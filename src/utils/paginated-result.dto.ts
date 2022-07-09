import { QueryBuilder } from '@mikro-orm/sqlite';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { PageMetaDto } from './page-meta.dto';
import { PaginatedRequestDto } from './paginated-request.dto';

export type CreatePaginatedResultParams<T extends AppEntity<T>> = {
  query: QueryBuilder<T>;
  dto: PaginatedRequestDto;
  orderColumn: keyof T;
};

export class PaginatedResultDto<T> {
  @ApiProperty({ type: PageMetaDto })
  meta: PageMetaDto;

  @ApiProperty({ isArray: true })
  data: T[];

  static async getResult<R extends AppEntity<R>>(params: CreatePaginatedResultParams<R>) {
    const { query, orderColumn } = params;
    const { order, page, take } = params.dto;

    query.orderBy({ [orderColumn]: order }).limit(take, (page - 1) * take);

    const result = new PaginatedResultDto<R>();
    result.data = await query.getResultList();
    result.meta = new PageMetaDto(params.dto, await query.getCount());

    return result;
  }
}
