import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { EntityDto } from '../../utils/entity.dto';

@Exclude()
export class FindWorkLogResponseUserDto {
  @ApiProperty()
  @Expose({ name: 'user_id' })
  id: string;

  @ApiProperty()
  @Expose({ name: 'user_name' })
  name: string;

  @ApiProperty()
  @Expose({ name: 'user_email' })
  email: string;
}

@Exclude()
export class FindWorkLogResponseDto extends EntityDto {
  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => plainToInstance(FindWorkLogResponseUserDto, obj))
  user: FindWorkLogResponseUserDto;

  @Expose()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @Expose({ name: 'started_at' })
  startedAt: Date;

  @ApiProperty()
  @Expose({ name: 'ended_at' })
  endedAt: Date;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => parseFloat(obj.__worked_hours))
  workedHours: number;
}
