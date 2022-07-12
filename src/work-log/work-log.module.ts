import { Module } from '@nestjs/common';
import { WorkLogService } from './work-log.service';
import { WorkLogController } from './work-log.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [WorkLogService],
  controllers: [WorkLogController],
})
export class WorkLogModule {}
