import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto implements Partial<User> {
  @IsNotEmpty()
  @ApiProperty({ example: 'test' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'test@mail.com' })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty()
  password: string;
}
