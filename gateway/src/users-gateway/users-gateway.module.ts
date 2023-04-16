import { Module } from '@nestjs/common';
import { UsersGatewayController } from './users-gateway.controller';

@Module({
  controllers: [UsersGatewayController],
})
export class UsersGatewayModule {}
