import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth-gateway.controller';
import { ClientProxiesModule } from '../client-proxies.module';

@Module({
  imports: [ClientProxiesModule],
  controllers: [AuthGatewayController],
})
export class AuthGatewayModule {}
