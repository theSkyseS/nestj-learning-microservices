import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { adminUser, nonExistentUser, registerUser, user } from './constants';
import { MicroserviceExceptionFilter } from '../src/microservice-exception.filter';

describe('UsersController (e2e)', () => {
  type Tokens = { access_token: string; refresh_token: string };
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new MicroserviceExceptionFilter());
    await app.init();
  });

  describe('/auth/login (POST)', () => {
    it('should respond 401 if password is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: adminUser.login,
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
      console.log(userTokens);
    });

    it('should remove refresh token from the database', async () => {
      console.log(userTokens);
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
      expect(response.body.user).toMatchObject({
        user: expect.any(Object),
        tokens: {
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        },
      });
      expect(response.body.user.tokens).toEqual<Tokens>({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
