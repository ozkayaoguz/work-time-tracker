import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EntityDto {
  @Expose()
  @ApiProperty()
  id: string;
}
