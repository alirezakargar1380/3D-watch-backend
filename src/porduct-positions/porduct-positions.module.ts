import { Module } from '@nestjs/common';
import { PorductPositionsService } from './porduct-positions.service';
import { PorductPositionsController } from './porduct-positions.controller';
import { ProductPositions } from './entities/product-position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductPositions
    ])
  ],
  controllers: [PorductPositionsController],
  providers: [PorductPositionsService],
})
export class PorductPositionsModule { }
