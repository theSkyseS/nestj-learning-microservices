import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { RolesController } from './roles.controller';
import { RoleModel } from './roles.model';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([RoleModel]),
    forwardRef(() => AuthModule),
  ],
  exports: [RolesService],
})
export class RolesModule {}
