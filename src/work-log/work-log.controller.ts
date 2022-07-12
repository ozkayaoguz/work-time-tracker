import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponse, PaginatedApiResponse } from '../utils/default-api-response.decorator';
import { FindWorkLogRequestDto } from './dto/find-work-log-request.dto';
import { FindWorkLogResponseDto } from './dto/find-work-log-response.dto';
import { StartWorkDto } from './dto/start-work.dto';
import { WorkLogDto } from './dto/work-log.dto';
import { WorkLogService } from './work-log.service';

@ApiTags('work log')
@Controller('workLog')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Post('start/:userId')
  @ApiOperation({ summary: 'Start work' })
  @DefaultApiResponse({ type: WorkLogDto })
  startWork(@Body() dto: StartWorkDto, @Param('userId', ParseUUIDPipe) id: string) {
    return this.workLogService.startWork(id, dto);
  }

  @Post('finish/:userId')
  @ApiOperation({ summary: 'Finish work' })
  @DefaultApiResponse({ type: WorkLogDto })
  finishWork(@Param('userId', ParseUUIDPipe) id: string) {
    return this.workLogService.finishWork(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find work logs' })
  @PaginatedApiResponse(FindWorkLogResponseDto)
  find(@Query() dto: FindWorkLogRequestDto) {
    return this.workLogService.find(dto);
  }
}
