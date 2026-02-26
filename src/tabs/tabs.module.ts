import { Module } from '@nestjs/common';
import { TabsService } from './tabs.service';
import { TabsController } from './tabs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tabs } from './entities/tab.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tabs
    ])
  ],
  controllers: [TabsController],
  providers: [TabsService],
})
export class TabsModule {}
