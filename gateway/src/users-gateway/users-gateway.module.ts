import { Module } from '@nestjs/common';
import { UsersGatewayController } from './users-gateway.controller';
import { ClientProxiesModule } from '../client-proxies.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ClientProxiesModule, AuthModule],
  controllers: [UsersGatewayController],
})
export class UsersGatewayModule {}
