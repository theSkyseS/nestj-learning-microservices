import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from './profiles/profiles.model';
import { ProfilesModule } from './profiles/profiles.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger.interceptor';

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
