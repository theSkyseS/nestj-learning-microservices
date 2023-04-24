import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import {
  adminUser,
  adminUserHashedPassword,
  user,
  userHashedPassword,
} from './constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

let app: INestApplication;
let authService: ClientProxy;

module.exports = async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  authService = app.get<ClientProxy>('AUTH_SERVICE');

  await Promise.all([
    lastValueFrom(
      authService.send('roles.create', {
        name: 'USER',
      }),
    ),
    lastValueFrom(
      authService.send('roles.create', {
        name: 'ADMIN',
      }),
    ),
  ]);

  const createdAdmin = await lastValueFrom(
    authService.send('users.create', {
      login: adminUser.login,
      password: adminUserHashedPassword,
    }),
  );

  await lastValueFrom(
    authService.send('users.create', {
      login: user.login,
      password: userHashedPassword,
    }),
  );

  authService.send('users.addRole', {
    userId: createdAdmin.id,
    roleId: 'ADMIN',
  });
};
