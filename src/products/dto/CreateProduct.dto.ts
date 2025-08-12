import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsIn, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  regularPrice?: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsString()
  @IsIn(['simple', 'variable', 'grouped', 'external'])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['publish', 'draft', 'pending', 'private'])
  status?: string;

  @IsOptional()
  @IsNumber()
  stockQuantity?: number;

  @IsOptional()
  @IsString()
  @IsIn(['instock', 'outofstock', 'onbackorder'])
  stockStatus?: string;

  @IsBoolean()
  manageStock: boolean;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsObject()
  dimensions?: { length?: number; width?: number; height?: number };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  variations?: any[];

  @IsOptional()
  @IsString()
  purchaseNote?: string;

  @IsBoolean()
  soldIndividually: boolean;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  regularPrice?: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsString()
  @IsIn(['simple', 'variable', 'grouped', 'external'])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['publish', 'draft', 'pending', 'private'])
  status?: string;

  @IsOptional()
  @IsNumber()
  stockQuantity?: number;

  @IsOptional()
  @IsString()
  @IsIn(['instock', 'outofstock', 'onbackorder'])
  stockStatus?: string;

  @IsOptional()
  @IsBoolean()
  manageStock?: boolean;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsObject()
  dimensions?: { length?: number; width?: number; height?: number };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  variations?: any[];

  @IsOptional()
  @IsString()
  purchaseNote?: string;

  @IsOptional()
  @IsBoolean()
  soldIndividually?: boolean;
}
