import { Test, TestingModule } from '@nestjs/testing';
import { PorductPositionsService } from './porduct-positions.service';

describe('PorductPositionsService', () => {
  let service: PorductPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PorductPositionsService],
    }).compile();

    service = module.get<PorductPositionsService>(PorductPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
