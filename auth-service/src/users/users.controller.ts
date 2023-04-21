import { Controller, UseInterceptors } from '@nestjs/common';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AckInterceptor } from '../ack.interceptor';

@UseInterceptors(AckInterceptor)
@Controller()
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @MessagePattern('users.getAll')
  getAll() {
    return this.usersServise.getAllUsers();
  }

  @MessagePattern('users.getOne')
  getOne(@Payload() id: number) {
    return this.usersServise.getUserById(id);
  }

  @MessagePattern('users.create')
  create(@Payload() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @MessagePattern('users.update')
  update(
    @Payload('id') id: number,
    @Payload('userDto') userDto: UpdateUserDto,
  ) {
    return this.usersServise.updateUser(id, userDto);
  }

  @MessagePattern('users.delete')
  delete(@Payload() id: number) {
    return this.usersServise.deleteUser(id);
  }

  @MessagePattern('users.removeRole')
  removeRole(@Payload() dto: AddRoleDto) {
    return this.usersServise.removeRoleFromUser(dto);
  }

  @MessagePattern('users.addRole')
  addRole(@Payload() dto: AddRoleDto) {
    return this.usersServise.addRoleToUser(dto);
  }

  @MessagePattern('users.truncate')
  truncate() {
    return this.usersServise.truncate();
  }
}
