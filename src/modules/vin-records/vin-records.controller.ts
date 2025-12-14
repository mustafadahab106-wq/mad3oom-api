import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { VinRecordsService } from './vin-records.service';

@Controller('vin-records')
export class VinRecordsController {
  constructor(private readonly service: VinRecordsService) {}

  @Get('search')
  async search(@Query('vin') vin: string) {
    if (!vin) throw new NotFoundException('VIN required');

    const record = await this.service.findByVin(vin);
    if (!record) throw new NotFoundException('Record not found');

    return record;
  }
}
