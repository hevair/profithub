import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.productsService.findAll(user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.findOne(id, user.tenantId);
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.tenantId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, user.tenantId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.remove(id, user.tenantId);
  }
}
