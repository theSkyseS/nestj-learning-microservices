import { Module } from '@nestjs/common';
import { AuthGatewayModule } from './auth-gateway/auth-gateway.module';
import { UsersGatewayModule } from './users-gateway/users-gateway.module';

@Module({
  imports: [AuthGatewayModule, UsersGatewayModule],
})
export class AppModule {}
