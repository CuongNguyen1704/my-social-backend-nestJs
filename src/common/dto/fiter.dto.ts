import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class FilterDto<T = Record<string, any>> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 3;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  // @ValidateNested()
  // @Type(() => Object)
  // @Transform(({ obj }) => {
  //   // Convert 'filters[name]' => filters: { name: ... }
  //   const filters: Record<string, any> = {};
  //   for (const key in obj) {
  //     const match = key.match(/^filters\[(.+)\]$/);
  //     if (match) {
  //       filters[match[1]] = obj[key];
  //     }
  //   }
  //   return filters;
  // })
  filters?: T;
}
