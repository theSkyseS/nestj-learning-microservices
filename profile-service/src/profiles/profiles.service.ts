import { Injectable, NotFoundException } from '@nestjs/common';
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
      where: { userId: userId },
    });
  }

  async getProfileById(id: string) {
    return await this.profileRepository.findByPk(id);
  }

  async createProfile(userDto: CreateProfileDto) {
    return await this.profileRepository.create(userDto);
  }

  async updateProfile(id: string, userDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findByPk(id);
    return await profile.update(userDto);
  }

  async deleteProfile(id: string) {
    const profile = await this.profileRepository.findByPk(id);
    return await profile.destroy();
  }

  async truncate() {
    if (process.env.NODE_ENV === 'test') {
      return await this.profileRepository.truncate({
        cascade: true,
        restartIdentity: true,
      });
    }
    throw new NotFoundException();
  }
}
