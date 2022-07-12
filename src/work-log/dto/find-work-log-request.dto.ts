import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginatedRequestDto } from '../../utils/paginated-request.dto';

export class FindWorkLogRequestDto extends PaginatedRequestDto {
  @MaxLength(64)
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({ description: `String date: ${new Date().toISOString()}` })
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
