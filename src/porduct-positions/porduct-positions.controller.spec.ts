import { Test, TestingModule } from '@nestjs/testing';
import { PorductPositionsController } from './porduct-positions.controller';
import { PorductPositionsService } from './porduct-positions.service';

describe('PorductPositionsController', () => {
  let controller: PorductPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PorductPositionsController],
      providers: [PorductPositionsService],
    }).compile();

    controller = module.get<PorductPositionsController>(PorductPositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
