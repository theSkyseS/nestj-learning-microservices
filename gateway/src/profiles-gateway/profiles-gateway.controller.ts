import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.send('profiles.create', dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.send('profiles.update', { id, dto });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.profileService.send('profiles.delete', id);
  }
}
