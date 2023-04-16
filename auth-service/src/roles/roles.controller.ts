import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleModel } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Creates a new role' })
  @ApiResponse({ status: 201, type: RoleModel })
  @ApiBody({ type: CreateRoleDto })
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @ApiOperation({ summary: 'Retrieves all roles from the Database' })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Get()
  getAll() {
    return this.rolesService.getAllRoles();
  }

  @ApiOperation({
    summary: 'Retrieves role with specified name from the Database',
  })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.rolesService.getRoleByName(name);
  }
}
