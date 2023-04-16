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
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';
import { ProfileModel } from '../profiles/profiles.model';
import { ProfilesService } from '../profiles/profiles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './users.model';
import { UsersService } from './users.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(
    private usersServise: UsersService,
    private profilesService: ClientProxy,
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @Get()
  getAll() {
    return this.usersServise.getAllUsers();
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.usersServise.login(userDto);
  }

  @Post('/register')
  register(@Body() userDto: CreateProfileDto) {
    return this.profilesService.registerNewUser(userDto);
  }

  @UseGuards(AuthGuard)
  @Post('/refresh')
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.usersServise.refresh(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@Body('refresh_token') refreshToken: string) {
    return this.usersServise.logout(refreshToken);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post('/role/remove')
  removeRole(@Body() dto: AddRoleDto) {
    return this.usersServise.removeRoleFromUser(dto);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersServise.addRoleToUser(dto);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.usersServise.getUserById(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: number, @Body() userDto: UpdateUserDto) {
    return this.usersServise.updateUser(id, userDto);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersServise.deleteUser(id);
  }
}
