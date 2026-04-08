import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.tenantId);
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.tenantId, dto);
  }
}
