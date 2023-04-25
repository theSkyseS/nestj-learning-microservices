// Import the necessary modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleModel } from './roles.model';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleRepository: typeof RoleModel,
  ) {}

  async getAllRoles(): Promise<RoleModel[]> {
    return await this.roleRepository.findAll();
  }

  async getRoleByName(name: string): Promise<RoleModel> {
    return await this.roleRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async createRole(role: CreateRoleDto): Promise<RoleModel> {
    return await this.roleRepository.create(role);
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return await this.roleRepository.truncate({
        cascade: true,
        restartIdentity: true,
      });
    }
    throw new RpcException(new NotFoundException());
  }
}
