import { ClientProxy } from '@nestjs/microservices';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

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
    authService.send('users.truncate', {}),
    authService.send('roles.truncate', {}),
    authService.send('auth.truncate', {}),
    profileService.send('profiles.truncate', {}),
  ]);
  await truncates;
  await app.close();
};
