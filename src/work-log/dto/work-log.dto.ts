import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { EntityDto } from '../../utils/entity.dto';

@Exclude()
export class WorkLogDto extends EntityDto {
  @ApiProperty()
  @Expose({ name: 'user_id' })
  userId: string;

  @Expose()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @Expose({ name: 'started_at' })
  startedAt: Date;

  @ApiProperty()
  @Expose({ name: 'ended_at' })
  endedAt: Date;
}
