  import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
  import { ProductService } from './products.service';
  import { CreateProductDto, UpdateProductDto } from './dto/CreateProduct.dto';
  import { FilterProductDto } from './dto/FilterProduct.dto';

  @Controller('products')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    create(@Body() dto: CreateProductDto) {
      return this.productService.create(dto);
    }

  @Get('filter')
  async filter(@Query() rawQuery: any) {
    const query: FilterProductDto = {
      ...rawQuery,
      categories: rawQuery.categories ? rawQuery.categories.split(',') : undefined,
      priceMin: rawQuery.priceMin ? parseFloat(rawQuery.priceMin) : undefined,
      priceMax: rawQuery.priceMax ? parseFloat(rawQuery.priceMax) : undefined,
    };

    return this.productService.filter(query);
  }

    @Get()
    findAll(@Query() query) {
      if (Object.keys(query).length === 0) {
        return this.productService.findAll();
      }
      return this.productService.filter(query);
    }
    

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.productService.findById(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
      return this.productService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.productService.remove(id);
    }
  }
