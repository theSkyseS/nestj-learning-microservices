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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returned users',
  })
  @Get()
  getAll() {
    return this.authService.send('users.getAll', {});
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returned user',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.authService.send('users.getOne', id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() userDto: LoginDto) {
    return this.authService.send('users.create', userDto);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiOkResponse({ description: 'The updated user', type: UpdateUserDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.authService.send('users.update', { id, userDto });
  }

  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully removed.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.send('users.remove', id);
  }

  @ApiOperation({ summary: 'Deletes user' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({
    description: 'Role name to remove',
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string' },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/roles/remove')
  removeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.authService.send('users.removeRole', { id, role });
  }

  @ApiOperation({ summary: 'Adds role to a user' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully added.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/roles/add')
  addRole(@Param('id') id: string, @Body('role') role: string) {
    return this.authService.send('users.addRole', { userId: id, role });
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returned user profile',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.profileService.send('profiles.getByUserId', id);
  }
}
