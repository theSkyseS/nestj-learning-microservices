import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { RefreshModel } from './refresh-token.model';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [SequelizeModule.forFeature([RefreshModel]), JwtModule, UsersModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
