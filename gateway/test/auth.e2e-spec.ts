import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as bcrypt from 'bcryptjs';
import {
  adminUser,
  newUser,
  nonExistentUser,
  registerUser,
  user,
  userHashedPassword,
} from './constants';

describe('UsersController (e2e)', () => {
  type Tokens = { access_token: string; refresh_token: string };
  let app: INestApplication;

  let adminTokens: Tokens;
  let userTokens: Tokens;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/login (POST)', () => {
    it('should respond 401 if password is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: adminUser.login,
          password: 'test',
        })
        .expect(401);
    });

    it("should respond 400 if user doesn't exist", async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(nonExistentUser)
        .expect(400);
    });

    it('should respond 201 if user exists and password is correct', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUser)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(201);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let userTokens: Tokens;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
      userTokens = response.body.response;
    });

    it('should return new tokens', async () => {
      console.log(userTokens);
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send({ refresh_token: userTokens.refresh_token })
        .expect(201);
      expect(response.body.tokens).toEqual<Tokens>({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });

  describe('/users/logout (POST)', () => {
    let userTokens: Tokens;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
      userTokens = response.body.response;
    });

    it('should remove refresh token from the database', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send({ refresh_token: userTokens.refresh_token })
        .expect(201);
    });
  });

  describe('/auth/register (POST)', () => {
    it('should return profile and tokens', async () => {
      const profile = {
        name: 'newer user',
        phoneNumber: '+79991234567',
        about: 'I am user',
        address: 'User st., 25',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerUser)
        .expect(201);
      expect(response.body.profile).toEqual(expect.objectContaining(profile));
      expect(response.body.tokens).toEqual<Tokens>({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });
});
