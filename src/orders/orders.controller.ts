import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { CartService } from 'src/cart/cart.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService
  ) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto | any, @Res() res: Response) {
    const order = await this.ordersService.create({
      order_number: this.ordersService.generateOrderNumber(),
      customer: {
        id: res.locals.user.id
      },
      address: {
        id: createOrderDto.address.id
      },
      createdAt: new Date()
    });

    await this.cartService.addItemsToOrders(order.id, res.locals.user.id)

    res.status(HttpStatus.CREATED).send(order)
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}