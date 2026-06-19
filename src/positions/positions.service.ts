import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Positions } from './entities/position.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Positions) private positionRepository: Repository<Positions>
  ) { }

  create(createPositionDto: CreatePositionDto) {
    return this.positionRepository.save(createPositionDto);
  }

  findAll() {
    return this.positionRepository.find();
  }

  findOne(id: number) {
    return this.positionRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    return this.positionRepository.update(id, updatePositionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}
