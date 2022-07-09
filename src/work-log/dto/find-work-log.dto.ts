import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginatedRequestDto } from '../../utils/paginated-request.dto';
import { BaseDto } from '../../utils/base.dto';
import { WorkLog } from '../work-log.entity';

export class FindWorkLogDto extends PaginatedRequestDto implements BaseDto<WorkLog> {
  @MaxLength(64)
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({ example: new Date().toISOString() })
  startedAfter?: Date;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  startedBefore?: Date;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  endedAfter?: Date;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  endedBefore?: Date;
}
