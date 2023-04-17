import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '../auth-gateway/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
  ) {}

  @Get()
  getAll() {
    return this.authService.send('users.getAll', {});
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.authService.send('users.getOne', id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() userDto: LoginDto) {
    return this.authService.send('users.create', userDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.authService.send('users.update', { id, userDto });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.send('users.remove', id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/roles/remove')
  removeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.authService.send('users.removeRole', { id, role });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/roles/add')
  addRole(@Param('id') id: string, @Body('role') role: string) {
    return this.authService.send('users.addRole', { userId: id, role });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.profileService.send('profiles.getByUserId', id);
  }
}
