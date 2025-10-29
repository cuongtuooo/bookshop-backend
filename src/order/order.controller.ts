import { Controller, Post, Body, Get, Param, Query, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ResponseMessage('Create new Order')
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @ResponseMessage('List all orders (with pagination)')
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: any
  ) {
    return this.orderService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Get order detail')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // 🆕 API cập nhật trạng thái
  @Patch(':id/status')
  @ResponseMessage('Cập nhật trạng thái đơn hàng')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser
  ) {
    return this.orderService.updateStatus(id, updateOrderDto.status, user);
  }
}
