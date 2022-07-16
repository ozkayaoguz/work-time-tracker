import { Injectable } from '@nestjs/common';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { Connection } from '../database/connection';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserRequestDto } from './dto/find-user-request.dto';
import { UserDto } from './dto/user.dto';
import { UserEmailAlreadyExistsError } from './error/user-email-already-exists.error';
import { UserNotFoundError } from './error/user-not-found.error';
import { UserRepository } from './user.repository';

const PASSWORD_SALT = process.env.PASSWORD_SALT || 'salt123';

const asyncScrypt = promisify((salt: string, str: string, cb: (err, res: string) => void) => {
  scrypt(str, salt, 48, (err, res) => cb(err, res.toString('base64')));
});

@Injectable()
export class UserService {
  constructor(private readonly db: Connection) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const repo = this.db.getRepository(UserRepository);
    const emailExists = await repo.isEmailExists(dto.email);
    if (emailExists) throw new UserEmailAlreadyExistsError();

    return await repo.createUser({ ...dto, password: await this.createPasswordHash(dto.password) });
  }

  isUserExists(id: string): Promise<boolean> {
    return this.db.getRepository(UserRepository).isUserExists(id);
  }

  async checkUserExists(id: string): Promise<void> {
    const exists = await this.isUserExists(id);
    if (!exists) throw new UserNotFoundError();
  }

  find(dto: FindUserRequestDto) {
    return this.db.getRepository(UserRepository).findUser(dto);
  }

  getUserByEmail(email: string) {
    return this.db.getRepository(UserRepository).getUserByEmail(email);
  }

  createPasswordHash(password: string): Promise<string> {
    return asyncScrypt(PASSWORD_SALT, password);
  }

  async isPasswordValid(password: string, hash: string): Promise<boolean> {
    const passHash = await this.createPasswordHash(password);

    return passHash === hash;
  }
}
