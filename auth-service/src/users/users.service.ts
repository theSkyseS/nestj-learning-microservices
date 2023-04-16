import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { RoleModel } from '../roles/roles.model';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private userRepository: typeof UserModel,
    private rolesService: RolesService,
    private authService: AuthService,
  ) {}

  async login(user: CreateUserDto) {
    const userData = await this.getUserByEmail(user.email);
    if (!userData) {
      throw new BadRequestException('User not found');
    }

    const isValid = await this.authService.validatePassword(
      user.password,
      userData.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.authService.generateToken(userData);
    this.authService.saveRefreshToken(tokens.refresh_token, userData.id);
    return { user: userData, response: tokens };
  }

  async register(user: CreateUserDto) {
    const transaction = await this.userRepository.sequelize.transaction();
    try {
      const userData = await this.getUserByEmail(user.email);
      if (userData) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(
        user.password,
        Number(process.env.PASSWORD_HASH_SALT),
      );
      const newUser = await this.createUser({
        ...user,
        password: hashedPassword,
      });
      const tokens = await this.authService.generateToken(newUser);
      this.authService.saveRefreshToken(tokens.refresh_token, newUser.id);
      await transaction.commit();
      return { user: newUser, tokens: tokens };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async logout(refreshToken: string) {
    await this.authService.removeRefreshToken(refreshToken);
    return true;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokenData = await this.authService.findRefreshToken(refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const userData = await this.getUserById(tokenData.userId);
    const tokens = await this.authService.generateToken(userData);
    this.authService.saveRefreshToken(tokens.refresh_token, userData.id);
    return { user: userData, tokens: tokens };
  }

  async createUser(dto: CreateUserDto): Promise<UserModel> {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByName('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers(): Promise<UserModel[]> {
    return await this.userRepository.findAll({ include: RoleModel });
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: { email },
      include: RoleModel,
    });
  }

  async getUserById(id: number): Promise<UserModel> {
    return await this.userRepository.findByPk(id, {
      include: RoleModel,
    });
  }

  async addRoleToUser(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByName(dto.role);
    if (role && user) {
      await user.$add('roles', role.id);
      return user;
    }
    throw new BadRequestException('Role or User not found');
  }

  async removeRoleFromUser(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByName(dto.role);
    if (role && user) {
      await user.$remove('roles', role.id);
      return user;
    }
    throw new BadRequestException(
      `Role: ${dto.role} or User: ${dto.userId} not found`,
    );
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    return await user.destroy();
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);
    if (dto.email) {
      const userData = await this.getUserByEmail(dto.email);
      if (userData) {
        throw new BadRequestException('User with this email already exists');
      }
      user.email = dto.email;
    }

    if (dto.password) {
      const hashedPassword = await bcrypt.hash(
        dto.password,
        Number(process.env.PASSWORD_HASH_SALT),
      );
      user.password = hashedPassword;
    }
    return await user.save();
  }
}
