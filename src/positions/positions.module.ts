import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Positions } from './entities/position.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Positions
    ])
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule { }
