import { Module } from '@nestjs/common';
import { RolesGatewayController } from './roles-gateway.controller';

@Module({
  controllers: [RolesGatewayController]
})
export class RolesGatewayModule {}
