import { EntityRepository } from '@mikro-orm/sqlite';
import { PaginatedResultDto } from '../utils/paginated-result.dto';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './user.entity';

export class UserRepository extends EntityRepository<User> {
  async isEmailExists(email: string): Promise<boolean> {
    const res = await this.findOne({ email }, { fields: ['id'] });

    return res !== null;
  }

  async isUserExists(id: string): Promise<boolean> {
    const res = await this.findOne({ id }, { fields: ['id'] });

    return res !== null;
  }

  async findUser(dto: FindUserDto) {
    const query = this.em.createQueryBuilder(User);

    if (dto.email) {
      query.andWhere({ email: { $like: `%${dto.email}%` } });
    }

    if (dto.name) {
      query.andWhere({ name: { $like: `%${dto.name}%` } });
    }

    return PaginatedResultDto.getResult({
      dto,
      query,
      orderColumn: 'createdAt',
    });
  }
}
