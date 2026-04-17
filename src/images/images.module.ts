import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './entities/image.entity';
import { ProductsService } from 'src/products/products.service';
import { Products } from 'src/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Images,
      Products,
    ])
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ProductsService],
})
export class ImagesModule {}
