import { Controller } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern('roles.getAll')
  getAll() {
    return this.rolesService.getAllRoles();
  }

  @MessagePattern('roles.getByName')
  getByName(@Payload('name') name: string) {
    return this.rolesService.getRoleByName(name);
  }

  @MessagePattern('roles.create')
  create(@Payload() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }
}
