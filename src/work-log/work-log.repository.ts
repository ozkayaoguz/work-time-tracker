import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { WorkLog } from './work-log.entity';

export class WorkLogRepository extends EntityRepository<WorkLog> {
  async addLog(userId: string, description: string): Promise<WorkLog> {
    const user = this.em.getReference(User, userId);

    const log = new WorkLog({ user, description });
    await this.persistAndFlush(log);
    return log;
  }

  getActiveLog(userId: string): Promise<WorkLog> {
    return this.findOne({ $and: [{ user: userId }, { endedAt: null }] });
  }
}
