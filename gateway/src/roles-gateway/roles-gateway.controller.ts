import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('roles')
export class RolesGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get()
  getAll() {
    return this.authService.send('roles.getAll', {});
  }

  @Get(':name')
  getOne(@Param('name') name: string) {
    return this.authService.send('roles.getByName', name);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() userDto: any) {
    return this.authService.send('roles.create', userDto);
  }
}
