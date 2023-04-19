import { Module } from '@nestjs/common';
import { ProfilesGatewayController } from './profiles-gateway.controller';
import { ClientProxiesModule } from '../client-proxies.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ClientProxiesModule, AuthModule],
  controllers: [ProfilesGatewayController],
})
export class ProfilesGatewayModule {}
