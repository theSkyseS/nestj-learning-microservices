import { Module } from '@nestjs/common';
import { ProfilesGatewayController } from './profiles-gateway.controller';

@Module({
  controllers: [ProfilesGatewayController],
})
export class ProfilesGatewayModule {}
