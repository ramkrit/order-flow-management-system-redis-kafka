import { Body, Controller, Get, Post, Req, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return await this.orders.create(req.user.id, dto.amount);
  }

  @Get()
  async list(@Req() req: any) {
    return await this.orders.listByUser(req.user.id);
  }

  @Get(':orderId')
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async orderSummary(@Req() req: any, @Param('orderId') orderId: string) {
    return await this.orders.detailById(req.user.id, orderId);
  }

}
