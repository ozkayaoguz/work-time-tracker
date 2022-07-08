import { Injectable } from '@nestjs/common';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEmailAlreadyExistsError } from './error/user-email-already-exists.error';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

//TODO: read salt from .env
const PASSWORD_SALT = 'salt123';

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

  createPasswordHash(password: string): Promise<string> {
    return asyncScrypt(PASSWORD_SALT, password);
  }

  async isPasswordValid(password: string, hash: string): Promise<boolean> {
    const passHash = await this.createPasswordHash(password);

    return passHash === hash;
  }
}
