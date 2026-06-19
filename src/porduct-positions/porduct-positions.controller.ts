import { Controller } from '@nestjs/common';
import { PorductPositionsService } from './porduct-positions.service';

@Controller('porduct-positions')
export class PorductPositionsController {
  constructor(private readonly porductPositionsService: PorductPositionsService) {}
}
