import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserWithPasswordDto } from 'src/user/dto/user-with-password.dto';
import { UserService } from '../user/user.service';
import { JWT_SECRET } from './auth.module';
import { AuthService } from './auth.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

const mockUserService: Partial<UserService> = {
  getUserByEmail: (email) => Promise.resolve({ email } as UserWithPasswordDto),
  isPasswordValid: async () => true,
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      providers: [AuthService, { provide: UserService, useValue: mockUserService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });

  it('createAccessToken should filter payload fields', async () => {
    const id = '5ae5f7b1-3f50-49de-9dfc-6fc936771f85';

    const token = await service.createAccessToken({
      id,
      __shouldRemoved: '__shouldRemoved__',
    } as JwtPayloadDto);

    const payload = await jwtService.verifyAsync(token);

    expect(payload.__shouldRemoved).toBeUndefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException when password invalid', async () => {
      jest.spyOn(mockUserService, 'isPasswordValid').mockResolvedValueOnce(false);

      const promise = service.login({ email: 'asdf', password: '1234' });
      await expect(promise).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValueOnce(null);

      const promise = service.login({ email: 'asdf', password: '1234' });
      await expect(promise).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should get user and access token', async () => {
      const email = 'john@doe.com';
      const res = await service.login({ email, password: '1234' });

      expect(res.accessToken).toBeDefined();
      expect(res.user.email).toEqual(email);
    });
  });
});
