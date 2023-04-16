import { Module } from '@nestjs/common';
import { ClientProxiesModule } from '../client-proxies.module';

@Module({
  imports: [ClientProxiesModule],
})
export class AuthModule {}
