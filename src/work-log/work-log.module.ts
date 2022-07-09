import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkLogService } from './work-log.service';
import { WorkLogController } from './work-log.controller';
import { WorkLog } from './work-log.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [WorkLog] }), UserModule],
  providers: [WorkLogService],
  controllers: [WorkLogController],
})
export class WorkLogModule {}
