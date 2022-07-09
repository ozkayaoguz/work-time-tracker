import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { StartWorkDto } from './dto/start-work.dto';
import { ActiveLogRecordNotFoundError } from './error/active-log-record-not-found.error';
import { LogRecordActiveError } from './error/log-record-active.error';
import { WorkLog } from './work-log.entity';
import { WorkLogRepository } from './work-log.repository';

@Injectable()
export class WorkLogService {
  constructor(
    private readonly workLogRepository: WorkLogRepository,
    private readonly userService: UserService,
  ) {}

  async startWork(userId: string, dto: StartWorkDto): Promise<WorkLog> {
    await this.userService.checkUserExists(userId);

    const activeLog = await this.workLogRepository.getActiveLog(userId);
    if (activeLog) throw new LogRecordActiveError();

    return this.workLogRepository.addLog(userId, dto.description);
  }

  async finishWork(userId: string): Promise<WorkLog> {
    await this.userService.checkUserExists(userId);

    const activeLog = await this.workLogRepository.getActiveLog(userId);
    if (!activeLog) throw new ActiveLogRecordNotFoundError();

    activeLog.endedAt = new Date();

    await this.workLogRepository.persistAndFlush(activeLog);
    return activeLog;
  }
}
