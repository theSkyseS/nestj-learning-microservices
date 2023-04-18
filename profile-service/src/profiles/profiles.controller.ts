import { Controller, UseInterceptors } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AckInterceptor } from '../ack.interceptor';

@UseInterceptors(AckInterceptor)
@Controller()
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @MessagePattern('profiles.getAll')
  getAll() {
    return this.profilesService.getAllProfiles();
  }

  @MessagePattern('profiles.getByUserId')
  getByUserId(@Payload() userId: string) {
    return this.profilesService.getProfileByUserId(userId);
  }

  @MessagePattern('profiles.getOne')
  getById(@Payload('id') id: string) {
    return this.profilesService.getProfileById(id);
  }

  update(
    @Payload() { id, userDto }: { id: string; userDto: UpdateProfileDto },
  ) {
    return this.profilesService.updateProfile(id, userDto);
  }

  async delete(@Payload('id') id: string) {
    await this.profilesService.deleteProfile(id);
    return {
      message: 'Profile deleted successfully',
    };
  }
}
