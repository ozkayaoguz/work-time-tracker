import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEmailAlreadyExistsError } from './error/user-email-already-exists.error';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.isEmailExists(dto.email);
    if (emailExists) throw new UserEmailAlreadyExistsError();

    const user = new User(dto);
    await this.userRepository.persistAndFlush(user);
    return user;
  }
}
