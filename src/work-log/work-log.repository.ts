import { EntityRepository } from '@mikro-orm/sqlite';
import { PaginatedResultDto } from '../utils/paginated-result.dto';
import { User } from '../user/user.entity';
import { FindWorkLogDto } from './dto/find-work-log.dto';
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

  findWorkLogs(dto: FindWorkLogDto, userId?: string): Promise<PaginatedResultDto<WorkLog>> {
    const query = this.em.createQueryBuilder(WorkLog);

    if (userId) {
      query.andWhere({ user: userId });
    }

    if (dto.startedAfter) {
      query.andWhere({ startedAt: { $gte: dto.startedAfter } });
    }

    if (dto.startedBefore) {
      query.andWhere({ startedAt: { $lt: dto.startedBefore } });
    }

    if (dto.endedAfter) {
      query.andWhere({ endedAt: { $gte: dto.endedAfter } });
    }

    if (dto.endedBefore) {
      query.andWhere({ endedAt: { $lt: dto.endedBefore } });
    }

    if (dto.description) {
      query.andWhere({ description: { $like: `%${dto.description}%` } });
    }

    return PaginatedResultDto.getResult({
      dto,
      query,
      orderColumn: 'startedAt',
    });
  }
}
