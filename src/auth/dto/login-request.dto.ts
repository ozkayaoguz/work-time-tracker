import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
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
