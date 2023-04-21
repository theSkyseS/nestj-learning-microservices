import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Payload } from '../auth/auth.payload';
import { UserModel } from '../users/users.model';
import { RefreshModel } from './refresh-token.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshModel) private refreshRepository: typeof RefreshModel,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginDto) {
    const userData = await this.usersService.getUserByLogin(user.login);
    if (!userData) {
      throw new BadRequestException('User not found');
    }

    const isValid = await this.validatePassword(
      user.password,
      userData.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.generateToken(userData);
    this.saveRefreshToken(tokens.refresh_token, userData.id);
    return { user: userData, response: tokens };
  }

  async register(user: LoginDto) {
    const transaction = await this.refreshRepository.sequelize.transaction();
    try {
      const userData = await this.usersService.getUserByLogin(user.login);
      if (userData) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(
        user.password,
        Number(process.env.PASSWORD_HASH_SALT),
      );
      const newUser = await this.usersService.createUser({
        ...user,
        password: hashedPassword,
      });
      const tokens = await this.generateToken(newUser);
      this.saveRefreshToken(tokens.refresh_token, newUser.id);
      await transaction.commit();
      return { user: newUser, tokens: tokens };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async logout(refreshToken: string) {
    await this.removeRefreshToken(refreshToken);
    return true;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const decodedToken = await this.validateRefreshToken(refreshToken);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenData = await this.findRefreshToken(refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userData = await this.usersService.getUserById(tokenData.userId);
    if (userData.id !== decodedToken.id) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateToken(userData);
    this.saveRefreshToken(tokens.refresh_token, userData.id);
    return { user: userData, tokens: tokens };
  }

  async findRefreshToken(refreshToken: string) {
    return await this.refreshRepository.findByPk(refreshToken);
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const userData = await this.jwtService.verifyAsync<Payload>(
        refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  async validateAccessToken(accessToken: string) {
    try {
      const userData = await this.jwtService.verifyAsync<Payload>(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveRefreshToken(refreshToken: string, userId: number) {
    const tokenData = await this.refreshRepository.findOne({
      where: {
        userId,
      },
    });

    if (tokenData) {
      return await tokenData.update({
        refreshToken,
      });
    } else {
      return await this.refreshRepository.create({
        userId,
        refreshToken,
      });
    }
  }

  async removeRefreshToken(refreshToken: string) {
    const tokenData = await this.refreshRepository.findByPk(refreshToken);
    return await tokenData.destroy();
  }

  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateToken(newUser: UserModel) {
    const payload: Payload = {
      id: newUser.id,
      email: newUser.login,
      roles: newUser.roles.map((role) => role.name),
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }),
    };
  }

  async truncate() {
    if (process.env.NODE_ENV === 'test') {
      await this.refreshRepository.truncate({
        cascade: true,
        restartIdentity: true,
      });
    }
  }
}
