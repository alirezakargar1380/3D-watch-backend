import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartResource: Repository<Cart>
  ) { }
  create(createCartDto: CreateCartDto) {
    return this.cartResource.save(createCartDto);
  }

  findAll() {
    return this.cartResource.find({
      relations: {
        owner: true,
        product: {
          images: true
        }
      }
    });
  }

  async addItemsToOrders(order_id: number, user_id: number) {
    let cartItems: any = await this.cartResource.find({ where: { owner: { id: user_id } } });
    cartItems = cartItems.map((item) => {
      return {
        id: item.id,
        isOrderItem: true,
        order: { id: order_id }
      }
    })

    return this.cartResource.save(cartItems);
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return this.cartResource.softDelete({ id });
  }
}
