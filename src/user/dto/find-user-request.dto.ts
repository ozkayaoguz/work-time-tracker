import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { PaginatedRequestDto } from '../../utils/paginated-request.dto';

export class FindUserRequestDto extends PaginatedRequestDto {
  @MaxLength(64)
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @MaxLength(50)
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;
}
