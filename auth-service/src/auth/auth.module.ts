import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { RefreshModel } from './refresh-token.model';

@Module({
  providers: [AuthService],
  imports: [SequelizeModule.forFeature([RefreshModel]), JwtModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
