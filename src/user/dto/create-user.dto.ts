import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(64)
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
