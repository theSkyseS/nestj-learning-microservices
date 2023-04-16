import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { RolesModule } from '../roles/roles.module';
import { UserModel } from './users.model';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([UserModel]),
    RolesModule,
    forwardRef(() => ProfilesModule),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
