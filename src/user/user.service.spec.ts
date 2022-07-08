import { Test, TestingModule } from '@nestjs/testing';
import { createMockRepository } from '../mock.repository';
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

      const res = await service.create(user);

      expect(res).toMatchObject(user);
      expect(persist.mock.calls[0][0]).toEqual(expect.objectContaining(user));
      expect(flush.mock.calls.length).toEqual(1);
    });
  });
});
