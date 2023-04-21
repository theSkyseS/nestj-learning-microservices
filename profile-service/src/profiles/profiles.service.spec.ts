import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileModel } from './profiles.model';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  const userMock = {
    id: '1',
    login: 'johndoe@example.com',
    password: 'encryptedString123',
    roles: [],
  };

  const dto: CreateProfileDto = {
    login: 'janedoe@example.com',
    password: 'encryptedString123',
    name: 'Jane Doe',
    phoneNumber: '0987654321',
    about: 'I hate tomatoes',
    address: '456 Oak St',
  };

  const profileMock = {
    id: '1',
    name: 'Jane Doe',
    phoneNumber: '0987654321',
    about: 'I hate tomatoes',
    address: '456 Oak St',
    userId: undefined,
    user: undefined,
    $set: jest.fn(() => {
      profileMock.userId = userMock.id;
    }),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  let service: ProfilesService;
  let model: typeof ProfileModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getModelToken(ProfileModel),
          useValue: {
            findAll: jest.fn(() => [profileMock]),
            findOne: jest.fn(),
            findByPk: jest.fn(() => profileMock),
            create: jest.fn(() => profileMock),
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

    service = module.get<ProfilesService>(ProfilesService);
    model = module.get<typeof ProfileModel>(getModelToken(ProfileModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfileByUserId', () => {
    it('should query db with findOne', async () => {
      const id = '1';
      const where = {
        where: { user: id },
      };
      const findSpy = jest.spyOn(model, 'findOne');
      await service.getProfileByUserId(id);
      expect(findSpy).toHaveBeenCalledWith(where);
    });
  });

  describe('getProfileById', () => {
    it('should return a profile', async () => {
      const result = await service.getProfileById(profileMock.id);
      expect(result).toEqual(profileMock);
    });

    it('should query db with findByPk', async () => {
      const id = '1';
      const findSpy = jest.spyOn(model, 'findByPk');
      await service.getProfileById(id);
      expect(findSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('getAllProfiles', () => {
    it('should return array of profiles', async () => {
      const expectedProfile = {
        id: '1',
        name: 'Jane Doe',
        phoneNumber: '0987654321',
        about: 'I hate tomatoes',
        address: '456 Oak St',
        userId: userMock.id,
        user: userMock,
      };
      const result = await service.getAllProfiles();
      expect(result).toEqual([expect.objectContaining(expectedProfile)]);
    });

    it('should query db with findAll', async () => {
      const findSpy = jest.spyOn(model, 'findAll');
      await service.getAllProfiles();
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('createProfile', () => {
    it('should create a profile', async () => {
      const createSpy = jest.spyOn(model, 'create');
      await service.createProfile(dto);
      expect(createSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateProfile', () => {
    it('should query db with findByPk', async () => {
      const id = '1';
      const updateSpy = jest.spyOn(model, 'findByPk');
      await service.updateProfile(id, dto);
      expect(updateSpy).toHaveBeenCalledWith(id);
    });

    it('should update a profile', async () => {
      const updateSpy = jest.spyOn(profileMock, 'update');
      await service.updateProfile(profileMock.id, dto);
      expect(updateSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteProfile', () => {
    it('should query db with findByPk', async () => {
      const id = '1';
      const deleteSpy = jest.spyOn(model, 'findByPk');
      await service.deleteProfile(id);
      expect(deleteSpy).toHaveBeenCalledWith(id);
    });

    it('should delete a profile', async () => {
      const deleteSpy = jest.spyOn(profileMock, 'destroy');
      await service.deleteProfile(profileMock.id);
      expect(deleteSpy).toHaveBeenCalledWith();
    });
  });
});
