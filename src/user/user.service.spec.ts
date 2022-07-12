import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEmailAlreadyExistsError } from './error/user-email-already-exists.error';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { FindUserRequestDto } from './dto/find-user-request.dto';
import { UserNotFoundError } from './error/user-not-found.error';
import { ConnectionMock } from '../database/connection-mock';
import { Connection } from '../database/connection';
import { PaginatedResultDto } from '../utils/paginated-result.dto';
import { UserDto } from './dto/user.dto';

const connection = new ConnectionMock();
const repo = connection.getRepo<UserRepository>();
repo.isEmailExists = () => Promise.resolve(false);
repo.isUserExists = jest.fn(() => Promise.resolve(true));
repo.createUser = jest.fn((dto) => Promise.resolve(plainToInstance(UserDto, dto)));

repo.findUser = (dto) => {
  const res = new PaginatedResultDto<UserDto>();
  res.data = [];

  if (dto.name === 'test') res.data.push({ name: 'test' } as UserDto);

  return Promise.resolve(res);
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: Connection, useValue: connection }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create user', () => {
    it('should check email exists', async () => {
      var spy = jest.spyOn(repo, 'isEmailExists').mockImplementation(() => Promise.resolve(true));

      const email = 'john@doe.com';

      const promise = service.create({ email, name: '', password: '' });
      await expect(promise).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);

      expect(spy.mock.calls[0][0]).toEqual(email);

      spy.mockRestore();
    });

    it('should save user', async () => {
      const user = { email: 'test@mail.com', name: 'test', password: 'asd' } as CreateUserDto;

      await service.create(user);
      const saveParams = (repo.createUser as jest.Mock).mock.calls[0][0];

      const expectedSaveParams = expect.objectContaining({
        ...user,
        password: await service.createPasswordHash(user.password),
      });

      expect(saveParams).toMatchObject(expectedSaveParams);
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

  it('should get users', async () => {
    const dto = new FindUserRequestDto();
    dto.name = 'test';

    const res = await service.find(dto);

    expect(res.data[0].name).toEqual('test');
  });

  it('isUserExists method should call repository isUserExists method', async () => {
    const id = 'b28aec6f-54b1-4e53-a857-07806ce69db1';

    const res = await service.isUserExists(id);

    expect(res).toEqual(true);
    expect((repo.isUserExists as jest.Mock).mock.calls[0][0]).toEqual(id);
  });

  it('checkUserExists method should call repository isUserExists method', async () => {
    const id = '5f12c058-13c7-450d-806e-ee737bd4d2df';

    await service.checkUserExists(id);

    expect((repo.isUserExists as jest.Mock).mock.calls[0][0]).toEqual(id);
  });

  it('checkUserExists method should throw error when user not exists', async () => {
    const spy = jest.spyOn(repo, 'isUserExists').mockImplementation(() => Promise.resolve(false));

    const promise = service.checkUserExists('');
    await expect(promise).rejects.toBeInstanceOf(UserNotFoundError);

    spy.mockRestore();
  });
});
