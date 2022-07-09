import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BaseDto } from '../../utils/base.dto';
import { User } from '../user.entity';

export class CreateUserDto implements BaseDto<User> {
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'test' })
  name: string;

  @IsEmail()
  @MaxLength(64)
  @ApiProperty({ example: 'test@mail.com' })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty()
  password: string;
}
