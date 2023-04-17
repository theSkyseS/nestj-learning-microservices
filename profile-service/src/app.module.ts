import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { ProfileModel } from './profiles/profiles.model';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PROFILE_POSTGRES_HOST,
      port: Number(process.env.PROFILE_POSTGRES_PORT),
      username: process.env.PROFILE_POSTGRES_USER,
      password: process.env.PROFILE_POSTGRES_PASSWORD,
      database: process.env.PROFILE_POSTGRES_DB,
      autoLoadModels: true,
      models: [ProfileModel],
    }),
    ProfilesModule,
  ],
})
export class AppModule {}
