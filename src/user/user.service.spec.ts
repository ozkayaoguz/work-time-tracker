import { Test, TestingModule } from '@nestjs/testing';
import { createMockRepository } from '../utils/mock.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEmailAlreadyExistsError } from './error/user-email-already-exists.error';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const { repo, persist, flush } = createMockRepository<UserRepository>();
repo.isEmailExists = () => Promise.resolve(false);

describe('UserService', () => {
  let service: UserService;
  let userRepo: UserRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: repo }],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(UserRepository);
  });

  describe('create user', () => {
    it('should check email exists', async () => {
      var spy = jest
        .spyOn(userRepo, 'isEmailExists')
        .mockImplementation(() => Promise.resolve(true));

      const email = 'john@doe.com';

      const promise = service.create({ email, name: '', password: '' });
      await expect(promise).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);

      expect(spy.mock.calls[0][0]).toEqual(email);
      expect(persist.mock.calls.length).toEqual(0);

      spy.mockRestore();
    });

    it('should save user', async () => {
      const user = { email: 'test@mail.com', name: 'test', password: 'asd' } as CreateUserDto;

      const result = await service.create(user);

      const expected = expect.objectContaining({
        ...user,
        password: await service.createPasswordHash(user.password),
      });

      expect(result).toMatchObject(expected);
      expect(persist.mock.calls[0][0]).toEqual(expected);
      expect(flush.mock.calls.length).toEqual(1);
    });
  });

  describe('password hash', () => {
    it('should create different hashes', async () => {
      const pass0 = '123';
      const pass1 = '444';

      const hash0 = await service.createPasswordHash(pass0);
      const hash1 = await service.createPasswordHash(pass1);

      expect(hash0).not.toEqual(pass0);
      expect(hash1).not.toEqual(pass1);
      expect(hash0).not.toEqual(hash1);
    });

    it('should create same hashes with same pass', async () => {
      const pass0 = '123';

      const hash0 = await service.createPasswordHash(pass0);
      const hash1 = await service.createPasswordHash(pass0);

      expect(hash0).not.toEqual(pass0);
      expect(hash1).not.toEqual(pass0);
      expect(hash0).toEqual(hash1);
    });

    it('should validate hash', async () => {
      const pass = 'test555';

      const hash0 = await service.createPasswordHash(pass);
      const hash1 = await service.createPasswordHash('987');

      const res0 = await service.isPasswordValid(pass, hash0);
      const res1 = await service.isPasswordValid(pass, hash1);

      expect(res0).toEqual(true);
      expect(res1).toEqual(false);
    });
  });
});
