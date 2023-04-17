import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { UserModel } from './users.model';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([UserModel]), RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
