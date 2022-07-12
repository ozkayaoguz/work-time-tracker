import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RecordTimeEntityDto } from '../../utils/record-time-entity.dto';

@Exclude()
export class UserDto extends RecordTimeEntityDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  email: string;
}
