import { plainToInstance } from 'class-transformer';
import { Repository } from '../database/repository';
import { PaginatedResultDto } from '../utils/paginated-result.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserRequestDto } from './dto/find-user-request.dto';
import { UserDto } from './dto/user.dto';

export class UserRepository extends Repository {
  async isEmailExists(email: string): Promise<boolean> {
    const res = await this.db('user').select('id').where({ email }).limit(1);

    return res.length > 0;
  }

  async isUserExists(id: string): Promise<boolean> {
    const res = await this.db('user').select('id').where({ id }).limit(1);

    return res.length > 0;
  }

  async createUser(dto: CreateUserDto) {
    const res = await this.db('user')
      .insert({
        email: dto.email,
        name: dto.name,
        password: dto.password,
      })
      .returning('*')
      .then((x) => plainToInstance(UserDto, x));

    return res[0];
  }

  async findUser(dto: FindUserRequestDto) {
    const query = this.db('user').select('id', 'email', 'name', 'created_at', 'updated_at');

    if (dto.email) {
      query.andWhereILike('email', `%${dto.email}%`);
    }

    if (dto.name) {
      query.andWhereILike('name', `%${dto.name}%`);
    }

    return await PaginatedResultDto.getResult({
      dto,
      query,
      orderColumn: 'created_at',
      mapper: (x) => plainToInstance(UserDto, x),
    });
  }
}
