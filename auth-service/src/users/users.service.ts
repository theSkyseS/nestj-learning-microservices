import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
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
  ) {}

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

  async getUserByLogin(login: string): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: { login: login },
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
    throw new BadRequestException(
      `Role: ${dto.role} or User: ${dto.userId} not found`,
    );
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
    if (dto.login) {
      const userData = await this.getUserByLogin(dto.login);
      if (userData) {
        throw new BadRequestException('User with this email already exists');
      }
      user.login = dto.login;
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

  async truncate() {
    if (process.env.NODE_ENV === 'test') {
      return await this.userRepository.truncate({
        cascade: true,
        restartIdentity: true,
      });
    }
  }
}
