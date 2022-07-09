import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponse, PaginatedApiResponse } from '../utils/default-api-response.decorator';
import { FindWorkLogDto } from './dto/find-work-log.dto';
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

  @Get()
  @ApiOperation({ summary: 'Find work logs' })
  @PaginatedApiResponse(WorkLog)
  find(@Query() dto: FindWorkLogDto) {
    return this.workLogService.find(dto);
  }
}
