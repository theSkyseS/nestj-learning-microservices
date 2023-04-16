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
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileAccessGuard } from '../auth/profile-access.guard';

@Controller('profiles')
export class ProfilesGatewayController {
  constructor(
    @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
  ) {}

  @Get()
  getAll() {
    return this.profileService.send('profiles.getAll', {});
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.profileService.send('profiles.getOne', id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.send('profiles.create', dto);
  }

  @UseGuards(AuthGuard, ProfileAccessGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.send('profiles.update', { id, dto });
  }

  @UseGuards(AuthGuard, ProfileAccessGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.profileService.send('profiles.delete', id);
  }
}
