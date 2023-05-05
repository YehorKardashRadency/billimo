import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class GetTransactionsQuery {
  SearchString?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  Page: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  Take: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  Days?: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  IsDescending = true;
}
