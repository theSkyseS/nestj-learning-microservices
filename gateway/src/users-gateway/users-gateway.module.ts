import { Module } from '@nestjs/common';
import { UsersGatewayController } from './users-gateway.controller';
import { ClientProxiesModule } from '../client-proxies.module';

@Module({
  imports: [ClientProxiesModule],
  controllers: [UsersGatewayController],
})
export class UsersGatewayModule {}
