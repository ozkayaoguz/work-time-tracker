import { Knex } from 'knex';
import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';
import { PaginatedRequestDto } from './paginated-request.dto';

export type CreatePaginatedResultParams<T, R, D = R> = {
  query: Knex.QueryBuilder<T, R[]>;
  dto: PaginatedRequestDto;
  orderColumn: keyof T;
  mapper?: (result: R) => D;
};

export class PaginatedResultDto<T> {
  @ApiProperty()
  meta: PageMetaDto;

  @ApiProperty({ isArray: true })
  data: T[] = [];

  static async getResult<T, R, D = R>(params: CreatePaginatedResultParams<T, R, D>) {
    const { query, orderColumn, mapper } = params;
    const { order, page, take } = params.dto;
    const offset = (page - 1) * take;
    const result = new PaginatedResultDto<D>();

    const total = await query
      .clone()
      .clearSelect()
      .count('* as __total')
      .then((x) => parseInt(x[0].__total));

    result.meta = new PageMetaDto(params.dto, total);

    if (total <= offset) return result;

    query.orderBy(orderColumn, order).limit(take).offset(offset);

    if (mapper) result.data = await query.then((rows: any) => rows.map((x) => mapper(x)));
    else result.data = (await query) as D[];

    return result;
  }
}
