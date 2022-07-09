import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { PaginatedRequestDto } from '../../utils/paginated-request.dto';
import { BaseDto } from '../../utils/base.dto';
import { User } from '../user.entity';

export class FindUserDto extends PaginatedRequestDto implements BaseDto<User> {
  @MaxLength(64)
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @MaxLength(50)
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;
}
