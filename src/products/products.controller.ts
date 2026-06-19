import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: any) {
    console.log(createProductDto)
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    let products = await this.productsService.findAll();

    products = products.map((product) => {
      return {
        ...product,
        images: product.images.map((img) => {
          return {
            ...img,
            name: './img/' + img.name
          }
        })
      }
    })

    res.status(HttpStatus.ACCEPTED).send(products)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    let product: any = await this.productsService.findOne(+id);

    product.tabs = product.tabs.map((tab) => {
      return {
        ...tab,
        colors: tab.colors.map((color) => {
          return {
            ...color,
            objects: (color.objects.length === 0) ? [] : color.objects.split(',')
          }
        })
      }
    })

    res.status(HttpStatus.ACCEPTED).send(product)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {

    console.log(updateProductDto.positions[0])

    updateProductDto.tabs = updateProductDto.tabs.map((tab) => {
      return {
        ...tab,
        colors: tab.colors.map((color) => {
          return {
            ...color,
            objects: color.objects.join(',')
          }
        })
      }
    })

    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
