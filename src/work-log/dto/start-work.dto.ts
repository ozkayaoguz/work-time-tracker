import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseDto } from '../../utils/base.dto';
import { WorkLog } from '../work-log.entity';

export class StartWorkDto implements BaseDto<WorkLog> {
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({ example: 'desc.' })
  description: string;
}
