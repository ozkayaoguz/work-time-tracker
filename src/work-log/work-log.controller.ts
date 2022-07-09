import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponse } from '../utils/default-api-response.decorator';
import { StartWorkDto } from './dto/start-work.dto';
import { WorkLog } from './work-log.entity';
import { WorkLogService } from './work-log.service';

@ApiTags('work log')
@Controller('workLog')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Post('start/:userId')
  @ApiOperation({ summary: 'Start work' })
  @DefaultApiResponse({ type: WorkLog })
  startWork(@Body() dto: StartWorkDto, @Param('userId', ParseUUIDPipe) id: string) {
    return this.workLogService.startWork(id, dto);
  }

  @Post('finish/:userId')
  @ApiOperation({ summary: 'Finish work' })
  @DefaultApiResponse({ type: WorkLog })
  finishWork(@Param('userId', ParseUUIDPipe) id: string) {
    return this.workLogService.finishWork(id);
  }
}
