import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from './entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images) private filesRepository: Repository<Images>
  ) { }

  async save(data: any) {
    return this.filesRepository.save(data)
  }

  async newFolder(name: string) {
    return this.filesRepository.save({
      name: name
    })
  }

  async noMainImage(product_id: string) {
    return this.filesRepository.update({
      product: { id: Number(product_id) }
    }, {
      main: false
    })
  }

  async setMainImage(file_id: any) {
    return this.filesRepository.update({
      id: file_id
    }, {
      main: true
    })
  }

  async deleteAllProductImages(product_id: number) {
    return this.filesRepository.delete({
      product: { id: product_id }
    })
  }

  async insertMulti(data: any) {
    return this.filesRepository.createQueryBuilder().insert().into(Images).values(data)
      .execute()
  }

  findOne(id: number) {
    return this.filesRepository.findOne({
      where: { id: id }
    })
  }

  deleteOne(id: number) {
    return this.filesRepository.delete({ id: id })
  }
}
