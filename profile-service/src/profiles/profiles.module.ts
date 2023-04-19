import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfilesController } from './profiles.controller';
import { ProfileModel } from './profiles.model';
import { ProfilesService } from './profiles.service';

@Module({
  providers: [ProfilesService],
  controllers: [ProfilesController],
  imports: [SequelizeModule.forFeature([ProfileModel])],
  exports: [ProfilesService],
})
export class ProfilesModule {}
