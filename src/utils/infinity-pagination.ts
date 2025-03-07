import { ApiProperty } from '@nestjs/swagger';
import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';

export const infinityPagination = <T>(data: T[], options: IPaginationOptions): InfinityPaginationResultType<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};

export class PageDTO {
  @ApiProperty({ default: 1, required: false })
  page: number;
}
export class LimitDTO {
  @ApiProperty({ default: 10, required: false })
  limit: number;
}
