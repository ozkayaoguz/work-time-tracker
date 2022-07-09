import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC',
}

export class PaginatedRequestDto {
  @IsEnum(Order)
  @IsOptional()
  @ApiPropertyOptional({ enum: Order, default: Order.Asc })
  order: Order = Order.Asc;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 15 })
  take: number = 15;
}
