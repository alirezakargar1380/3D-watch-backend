import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products) private productRepository: Repository<Products>
  ) { }
  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: { tabs: { colors: true } }
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.save({
      id,
      ...updateProductDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
