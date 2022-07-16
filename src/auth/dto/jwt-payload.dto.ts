import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JwtPayloadDto {
  @Expose()
  @ApiProperty()
  id: string;
}

declare module 'express' {
  export interface Request {
    user: JwtPayloadDto;
  }
}
