import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileModel } from './profiles.model';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(ProfileModel) private profileRepository: typeof ProfileModel,
  ) {}

  async getAllProfiles() {
    return await this.profileRepository.findAll();
  }

  async getProfileByUserId(userId: string) {
    return await this.profileRepository.findOne({
      where: { user: userId },
    });
  }

  async getProfileById(id: string) {
    return await this.profileRepository.findByPk(id);
  }

  async updateProfile(id: string, userDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findByPk(id);
    return await profile.update(userDto);
  }

  async deleteProfile(id: string) {
    const profile = await this.profileRepository.findByPk(id);
    return await profile.destroy();
  }
}
