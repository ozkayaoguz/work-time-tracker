import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';

@Exclude()
export class UserWithPasswordDto extends UserDto {
  @Expose()
  @ApiProperty()
  password: string;
}
