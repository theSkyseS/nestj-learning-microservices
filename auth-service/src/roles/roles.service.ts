// Import the necessary modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleModel } from './roles.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
  ) {}

  async getAllRoles(): Promise<RoleModel[]> {
    return await this.roleModel.findAll();
  }

  async getRoleByName(name: string): Promise<RoleModel> {
    return await this.roleModel.findOne({
      where: {
        name: name,
      },
    });
  }

  async createRole(role: CreateRoleDto): Promise<RoleModel> {
    return await this.roleModel.create(role);
  }
}
