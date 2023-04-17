import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProfilesController } from './profiles.controller';
import { ProfileModel } from './profiles.model';
import { ProfilesService } from './profiles.service';

@Module({
  providers: [ProfilesService],
  controllers: [ProfilesController],
  imports: [
    SequelizeModule.forFeature([ProfileModel]),
    forwardRef(() => UsersModule),
    AuthModule,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
