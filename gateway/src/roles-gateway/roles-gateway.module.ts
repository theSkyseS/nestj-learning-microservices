import { Module } from '@nestjs/common';
import { RolesGatewayController } from './roles-gateway.controller';
import { AuthModule } from '../auth/auth.module';
import { ClientProxiesModule } from '../client-proxies.module';

@Module({
  imports: [ClientProxiesModule, AuthModule],
  controllers: [RolesGatewayController],
})
export class RolesGatewayModule {}
