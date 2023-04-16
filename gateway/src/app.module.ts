import { Module } from '@nestjs/common';
import { AuthGatewayModule } from './auth-gateway/auth-gateway.module';
import { UsersGatewayModule } from './users-gateway/users-gateway.module';
import { ProfilesGatewayModule } from './profiles-gateway/profiles-gateway.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthGatewayModule,
    UsersGatewayModule,
    ProfilesGatewayModule,
    AuthModule,
  ],
})
export class AppModule {}
