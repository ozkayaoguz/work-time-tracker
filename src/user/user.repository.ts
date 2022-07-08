import { EntityRepository } from '@mikro-orm/sqlite';
import { User } from './user.entity';

export class UserRepository extends EntityRepository<User> {
  async isEmailExists(email: string): Promise<boolean> {
    const res = await this.findOne({ email }, { fields: ['id'] });

    return res !== null;
  }
}
