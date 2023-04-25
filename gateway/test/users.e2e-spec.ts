import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as bcrypt from 'bcryptjs';
import {
  adminUser,
  newUser,
  registerUser,
  user,
  userHashedPassword,
} from './constants';
import { LoginDto } from '../src/auth-gateway/dto/login.dto';

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

  describe('/users (POST)', () => {
    const url = '/users';

    beforeEach(async () => {
      userTokens = await loginAsUser();
      adminTokens = await loginAsAdmin();
    });

    it('should respond 401 if unauthorized', async () => {
      await postNotAuthorized(url, newUser);
    });
    it('should respond 403 if not admin', async () => {
      await postNotAdmin(url, newUser);
    });

    it('should create a user and respond 201', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send(newUser)
        .expect(201);
      expect(response.body.login).toEqual(newUser.login);
    });
  });

  describe('/users (GET)', () => {
    it('should return array of objects', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(response.body.length).toBeGreaterThan(0);
      userId = response.body.find((x: LoginDto) => x.login === user.login).id;
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          login: user.login,
          password: userHashedPassword,
        }),
      );
    });
  });

  describe('/users/roles/add (POST)', () => {
    beforeEach(async () => {
      userTokens = await loginAsUser();
      adminTokens = await loginAsAdmin();
    });

    it('should respond 401 if unauthorized', async () => {
      await postNotAuthorized(`/users/${userId}/roles/add`, {
        userId: userId,
        role: 'ADMIN',
      });
    });
    it('should respond 403 if not admin', async () => {
      await postNotAdmin(`/users/${userId}/roles/add`, {
        userId: userId,
        role: 'ADMIN',
      });
    });

    it('should add role to user if admin', async () => {
      let response = await request(app.getHttpServer())
        .post(`/users/${userId}/roles/add`)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send({
          userId: userId,
          role: 'ADMIN',
        })
        .expect(201);
      expect(response.body.login).toEqual(user.login);
      response = await request(app.getHttpServer()).get(`/users/${userId}`);
      expect(response.body.roles).toContainEqual(
        expect.objectContaining({ name: 'ADMIN' }),
      );
    });
  });

  describe('/users/roles/remove (POST)', () => {
    beforeEach(async () => {
      userTokens = await loginAsUser();
      adminTokens = await loginAsAdmin();
    });

    it('should respond 401 if unauthorized', async () => {
      await postNotAuthorized(`/users/${userId}/roles/remove`, {
        role: 'ADMIN',
      });
    });

    it('should respond 403 if not admin', async () => {
      await postNotAdmin(`/users/${userId}/roles/remove`, {
        role: 'ADMIN',
      });
    });

    it('should remove role from user if admin', async () => {
      let response = await request(app.getHttpServer())
        .post(`/users/${userId}/roles/remove`)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send({
          role: 'ADMIN',
        })
        .expect(201);
      expect(response.body.login).toEqual(user.login);
      console.log(response.body);
      response = await request(app.getHttpServer()).get(`/users/${userId}`);
      console.log(response.body);
      expect(response.body.roles).not.toContainEqual(
        expect.objectContaining({ name: 'ADMIN' }),
      );
    });
  });

  describe('users/:id (PUT)', () => {
    const newEmail = 'newEmail@gmail.com';
    const newPassword = 'newPassword';

    beforeEach(async () => {
      userTokens = await loginAsUser();
      adminTokens = await loginAsAdmin();
    });

    it('should respond 401 if not authorized', async () => {
      await request(app.getHttpServer())
        .put(`/users/${+userId + 1}`)
        .send({
          login: newEmail,
          password: newPassword,
        })
        .expect(401);
    });

    it('should respond 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .put(`/users/${+userId + 1}`)
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send({
          login: newEmail,
          password: newPassword,
        })
        .expect(403);
    });

    it('should update user', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${+userId + 1}`)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send({
          login: newEmail,
          password: newPassword,
        })
        .expect(200);
      expect(response.body.login).toEqual(newEmail);
      expect(bcrypt.compareSync(newPassword, response.body.password)).toBe(
        true,
      );
    });
  });

  describe('/users/:id (DELETE)', () => {
    beforeEach(async () => {
      userTokens = await loginAsUser();
      adminTokens = await loginAsAdmin();
      console.log(userTokens);
      console.log(adminTokens);
    });

    it('should respond 401 if not authorized', async () => {
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(401);
    });

    it('should respond 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .query({ id: userId })
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .expect(403);
    });

    it('should delete user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .expect(200);
    });
  });

  async function loginAsAdmin() {
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(adminUser)
      .expect(201);
    return adminResponse.body.response;
  }

  async function loginAsUser() {
    const userResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(201);
    return userResponse.body.response;
  }

  async function postNotAuthorized(url: string, send: any) {
    return await request(app.getHttpServer()).post(url).send(send).expect(401);
  }

  async function postNotAdmin(url: string, send: any) {
    return await request(app.getHttpServer())
      .post(url)
      .set('Authorization', `Bearer ${userTokens.access_token}`)
      .send(send)
      .expect(403);
  }

  afterAll(async () => {
    await app.close();
  });
});
