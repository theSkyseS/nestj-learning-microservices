import { Module } from '@nestjs/common';
import { ProfilesGatewayController } from './profiles-gateway.controller';
import { ClientProxiesModule } from '../client-proxies.module';

@Module({
  imports: [ClientProxiesModule],
  controllers: [ProfilesGatewayController],
})
export class ProfilesGatewayModule {}
