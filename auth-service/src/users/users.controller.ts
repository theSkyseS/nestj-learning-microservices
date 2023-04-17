import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @MessagePattern('users.create')
  create(@Body() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @MessagePattern('users.getAll')
  getAll() {
    return this.usersServise.getAllUsers();
  }

  @MessagePattern('users.removeRole')
  removeRole(@Payload() dto: AddRoleDto) {
    return this.usersServise.removeRoleFromUser(dto);
  }

  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersServise.addRoleToUser(dto);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.usersServise.getUserById(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() userDto: UpdateUserDto) {
    return this.usersServise.updateUser(id, userDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersServise.deleteUser(id);
  }
}
