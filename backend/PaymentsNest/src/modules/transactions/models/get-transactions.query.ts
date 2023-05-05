import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class GetTransactionsQuery {
  SearchString?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  take: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  days?: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isDescending = true;
}
