import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
export class FilterProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsArray() categories?: string[];
  @IsOptional() @IsNumber() priceMin?: number;
  @IsOptional() @IsNumber() priceMax?: number;
  @IsOptional() @IsString() stockStatus?: string;
}
