import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';

describe('UsersService', () => {
  let service: UsersService;
  let model: typeof UserModel;

  const roleMock = {
    id: 1,
    name: 'ADMIN',
  };

  const userMock = {
    id: 1,
    login: 'user',
    password: 'encryptedString123',
    roles: [],

    $set: jest.fn(() => {
      userMock.roles = [roleMock];
    }),
    save: jest.fn(),
    destroy: jest.fn(),
  };

  const dto: CreateUserDto = {
    login: 'newUser',
    password: 'encryptedString321',
  };

  const existingDto: CreateUserDto = {
    login: 'user',
    password: 'encryptedString123',
  };

  const wrongDto: CreateUserDto = {
    login: undefined,
    password: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RolesService,
          useValue: {
            getRoleByName: jest.fn(() => roleMock),
          },
        },
        {
          provide: getModelToken(UserModel),
          useValue: {
            findAll: jest.fn(() => [userMock]),
            findOne: jest.fn(() => userMock),
            findByPk: jest.fn(() => userMock),
            create: jest.fn(() => userMock),
            destroy: jest.fn(),
            sequelize: {
              transaction: () => ({
                commit: jest.fn(),
                rollback: jest.fn(),
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<typeof UserModel>(getModelToken(UserModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.getAllUsers();
      expect(result).toEqual([expect.objectContaining(userMock)]);
    });

    it('should query db with findAll', async () => {
      const findSpy = jest.spyOn(model, 'findAll');
      await service.getAllUsers();
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('getUserByLogin', () => {
    const login = 'user';

    it('should return a user', async () => {
      const result = await service.getUserByLogin(login);
      expect(result).toEqual(expect.objectContaining(userMock));
    });

    it('should query db with findOne', async () => {
      const findSpy = jest.spyOn(model, 'findOne');
      await service.getUserByLogin(login);
      expect(findSpy).toHaveBeenCalledWith(login);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      const result = await service.getUserById(userMock.id);
      expect(result).toEqual(expect.objectContaining(userMock));
    });
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      const result = await service.createUser(dto);
      expect(result).toEqual(expect.objectContaining(userMock));
    });

    it('should query db with create', async () => {
      const createSpy = jest.spyOn(model, 'create');
      await service.createUser(dto);
      expect(createSpy).toHaveBeenCalledWith(dto);
    });

    it('should create transcaction', async () => {
      const createSpy = jest.spyOn(model.sequelize, 'transaction');
      await service.createUser(dto);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should commit transaction', async () => {
      const createSpy = jest.spyOn(
        await model.sequelize.transaction(),
        'commit',
      );
      await service.createUser(dto);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should rollback transaction when dto is wrong', async () => {
      const createSpy = jest.spyOn(
        await model.sequelize.transaction(),
        'rollback',
      );
      await service.createUser(wrongDto);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should throw an error when dto is wrong', async () => {
      expect(async () => {
        await service.createUser(wrongDto);
      }).toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deleteSpy = jest.spyOn(model, 'destroy');
      await service.deleteUser(userMock.id);
      expect(deleteSpy).toHaveBeenCalledWith(userMock.id);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateSpy = jest.spyOn(userMock, 'save');
      await service.updateUser(userMock.id, dto);
      expect(updateSpy).toHaveBeenCalledWith(userMock.id, dto);
    });

    it('should call findOne', async () => {
      const findOneSpy = jest.spyOn(model, 'findOne');
      await service.updateUser(userMock.id, dto);
      expect(findOneSpy).toHaveBeenCalledWith(dto.login);
    });

    it('should throw an error if user already exists', async () => {
      await expect(async () => {
        await service.updateUser(userMock.id, existingDto);
      }).rejects.toThrow();
    });

    it('should set login and password if present', async () => {
      const result = await service.updateUser(userMock.id, dto);
      expect(result).toEqual(expect.objectContaining(dto));
    });
  });
});
