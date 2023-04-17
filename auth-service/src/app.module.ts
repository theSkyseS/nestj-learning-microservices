import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { RefreshModel } from './auth/refresh-token.model';
import { RoleModel } from './roles/roles.model';
import { RolesModule } from './roles/roles.module';
import { UserRolesModel } from './roles/user-roles.model';
import { UserModel } from './users/users.model';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.AUTH_POSTGRES_HOST,
      port: Number(process.env.AUTH_POSTGRES_PORT),
      username: process.env.AUTH_POSTGRES_USER,
      password: process.env.AUTH_POSTGRES_PASSWORD,
      database: process.env.AUTH_POSTGRES_DB,
      models: [UserModel, RoleModel, UserRolesModel, RefreshModel],
    }),
    UsersModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
