import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class StartWorkDto {
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({ example: 'desc.' })
  description: string;
}
