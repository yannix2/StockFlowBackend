import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto, UpdateProductDto } from './dto/CreateProduct.dto';
import { FilterProductDto } from './dto/FilterProduct.dto';
@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepo: Repository<Product>) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findById(id);
    await this.productRepo.remove(product);
  }

  // Smart filter for search, filter by name, sku, category, price range
async filter(query: FilterProductDto): Promise<Product[]> {
  let qb = this.productRepo.createQueryBuilder('product');

  if (query.name) {
    qb = qb.andWhere('product.name ILIKE :name', { name: `%${query.name}%` });
  }

  if (query.sku) {
    qb = qb.andWhere('product.sku ILIKE :sku', { sku: `%${query.sku}%` });
  }

if (query.categories && Array.isArray(query.categories)) {
  qb = qb.andWhere('product.categories @> :categories', { categories: JSON.stringify(query.categories) });
}

  if (query.priceMin !== undefined) {
    qb = qb.andWhere('product.price >= :priceMin', { priceMin: query.priceMin });
  }

  if (query.priceMax !== undefined) {
    qb = qb.andWhere('product.price <= :priceMax', { priceMax: query.priceMax });
  }

  if (query.stockStatus) {
    qb = qb.andWhere('product.stockStatus = :stockStatus', { stockStatus: query.stockStatus });
  }

  return qb.getMany();
}

}
