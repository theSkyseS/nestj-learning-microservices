import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthService } from '../auth/auth.service';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            createRole: jest.fn(),
            getAllRoles: jest.fn(),
            getRoleByName: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service with dto', () => {
      const role: CreateRoleDto = {
        name: 'Admin',
      };
      const createRoleSpy = jest.spyOn(rolesService, 'createRole');
      controller.create(role);

      expect(createRoleSpy).toHaveBeenCalledWith(role);
    });
  });
});
