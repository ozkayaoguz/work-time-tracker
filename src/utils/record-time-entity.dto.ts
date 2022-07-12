import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { EntityDto } from './entity.dto';

@Exclude()
export class RecordTimeEntityDto extends EntityDto {
  @ApiProperty()
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
