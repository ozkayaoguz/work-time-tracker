import { Injectable } from '@nestjs/common';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserEmailAlreadyExistsError } from './error/user-email-already-exists.error';
import { UserNotFoundError } from './error/user-not-found.error';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const PASSWORD_SALT = process.env.PASSWORD_SALT || 'salt123';

const asyncScrypt = promisify((salt: string, str: string, cb: (err, res: string) => void) => {
  scrypt(str, salt, 48, (err, res) => cb(err, res.toString('base64')));
});

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.isEmailExists(dto.email);
    if (emailExists) throw new UserEmailAlreadyExistsError();

    const user = new User({ ...dto, password: await this.createPasswordHash(dto.password) });
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  isUserExists(id: string): Promise<boolean> {
    return this.userRepository.isUserExists(id);
  }

  async checkUserExists(id: string): Promise<void> {
    const exists = await this.isUserExists(id);
    if (!exists) throw new UserNotFoundError();
  }

  find(dto: FindUserDto) {
    return this.userRepository.findUser(dto);
  }

  createPasswordHash(password: string): Promise<string> {
    return asyncScrypt(PASSWORD_SALT, password);
  }

  async isPasswordValid(password: string, hash: string): Promise<boolean> {
    const passHash = await this.createPasswordHash(password);

    return passHash === hash;
  }
}
