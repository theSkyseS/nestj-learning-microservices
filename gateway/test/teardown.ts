import { ClientProxy } from '@nestjs/microservices';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

let app: INestApplication;
let authService: ClientProxy;
let profileService: ClientProxy;

module.exports = async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  authService = app.get<ClientProxy>('AUTH_SERVICE');
  profileService = app.get<ClientProxy>('PROFILE_SERVICE');

  const truncates = Promise.all([
    lastValueFrom(authService.send('users.truncate', {})),
    lastValueFrom(authService.send('roles.truncate', {})),
    lastValueFrom(authService.send('auth.truncate', {})),
    lastValueFrom(profileService.send('profiles.truncate', {})),
  ]);
  await truncates;
  await app.close();
};
