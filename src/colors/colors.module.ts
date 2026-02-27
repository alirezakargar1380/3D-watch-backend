import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colors } from './entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Colors])
  ],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule { }
