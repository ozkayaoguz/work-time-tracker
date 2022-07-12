import { Injectable } from '@nestjs/common';
import { Connection } from '../database/connection';
import { UserService } from '../user/user.service';
import { FindWorkLogRequestDto } from './dto/find-work-log-request.dto';
import { StartWorkDto } from './dto/start-work.dto';
import { WorkLogDto } from './dto/work-log.dto';
import { ActiveLogRecordNotFoundError } from './error/active-log-record-not-found.error';
import { LogRecordActiveError } from './error/log-record-active.error';
import { WorkLogRepository } from './work-log.repository';

@Injectable()
export class WorkLogService {
  constructor(private readonly db: Connection, private readonly userService: UserService) {}

  async startWork(userId: string, dto: StartWorkDto): Promise<WorkLogDto> {
    await this.userService.checkUserExists(userId);

    const repo = this.db.getRepository(WorkLogRepository);
    const activeLog = await repo.getActiveLog(userId);
    if (activeLog) throw new LogRecordActiveError();

    return repo.addLog(userId, dto.description);
  }

  async finishWork(userId: string): Promise<WorkLogDto> {
    await this.userService.checkUserExists(userId);

    const repo = this.db.getRepository(WorkLogRepository);
    const activeLog = await repo.getActiveLog(userId);
    if (!activeLog) throw new ActiveLogRecordNotFoundError();

    return await repo.finishLog(activeLog.id);
  }

  find(dto: FindWorkLogRequestDto, userId?: string) {
    return this.db.getRepository(WorkLogRepository).findWorkLogs(dto, userId);
  }
}
