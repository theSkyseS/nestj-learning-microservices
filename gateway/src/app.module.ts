import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthGatewayModule } from './auth-gateway/auth-gateway.module';
import { UsersGatewayModule } from './users-gateway/users-gateway.module';
import { ProfilesGatewayModule } from './profiles-gateway/profiles-gateway.module';
import { AuthModule } from './auth/auth.module';
import { RolesGatewayModule } from './roles-gateway/roles-gateway.module';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    AuthGatewayModule,
    UsersGatewayModule,
    ProfilesGatewayModule,
    AuthModule,
    RolesGatewayModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
