import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Orders } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
  ) { }

  generateOrderNumber = () => Math.floor(Math.random() * 1000000);

  create(createOrderDto: any): Promise<Orders> {
    return this.orderRepository.save(createOrderDto);
  }

  findAll() {
    return this.orderRepository.find({
      relations: {
        products: true,
        address: true,
        owner: true,
      },
      withDeleted: true
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}