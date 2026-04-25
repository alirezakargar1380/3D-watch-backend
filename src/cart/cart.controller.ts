import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() createCartDto: any, @Res() res: Response) {
    try {
      return this.cartService.create({
        owner: {
          id: res.locals.user.id
        },
        ...createCartDto
      });
    } catch (e) {
      console.log(e)
    }
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
