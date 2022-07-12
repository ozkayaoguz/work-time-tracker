import { plainToInstance } from 'class-transformer';
import { Repository } from '../database/repository';
import { PaginatedResultDto } from '../utils/paginated-result.dto';
import { FindWorkLogRequestDto } from './dto/find-work-log-request.dto';
import { FindWorkLogResponseDto } from './dto/find-work-log-response.dto';
import { WorkLogDto } from './dto/work-log.dto';

export class WorkLogRepository extends Repository {
  async addLog(userId: string, description: string): Promise<WorkLogDto> {
    const res = await this.db('work_log')
      .insert({ user_id: userId, description })
      .returning('*')
      .then((x) => plainToInstance(WorkLogDto, x));

    return res[0];
  }

  async finishLog(id: string) {
    const res = await this.db('work_log')
      .where({ id })
      .update('ended_at', new Date())
      .returning('*')
      .then((x) => plainToInstance(WorkLogDto, x));

    return res[0];
  }

  async getActiveLog(userId: string): Promise<WorkLogDto> {
    const res = await this.db('work_log')
      .where({ user_id: userId, ended_at: null })
      .limit(1)
      .then((x) => plainToInstance(WorkLogDto, x));

    return res[0];
  }

  findWorkLogs(dto: FindWorkLogRequestDto, userId?: string) {
    const query = this.db('work_log')
      .join('user', 'work_log.user_id', '=', 'user.id')
      .select(
        'work_log.*',
        'user.id as user_id',
        'user.email as user_email',
        'user.name as user_name',
        this.db.raw(
          'EXTRACT(EPOCH FROM work_log.ended_at - work_log.started_at)/3600 as __worked_hours',
        ),
      );

    if (userId) {
      query.andWhere('user_id', '=', userId);
    }

    if (dto.startedAfter) {
      query.andWhere('started_at', '>=', dto.startedAfter);
    }

    if (dto.startedBefore) {
      query.andWhere('started_at', '<', dto.startedBefore);
    }

    if (dto.endedAfter) {
      query.andWhere('ended_at', '>=', dto.endedAfter);
    }

    if (dto.endedBefore) {
      query.andWhere('ended_at', '<', dto.endedBefore);
    }

    if (dto.description) {
      query.andWhereILike('description', `%${dto.description}%`);
    }

    return PaginatedResultDto.getResult({
      dto,
      query,
      orderColumn: 'started_at',
      mapper: (x) => plainToInstance(FindWorkLogResponseDto, x),
    });
  }
}
