import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VinRecord } from './vin-record.entity';

@Injectable()
export class VinRecordsService {
  constructor(
    @InjectRepository(VinRecord)
    private repo: Repository<VinRecord>,
  ) {}

  async findByVin(vin: string) {
    return await this.repo.findOne({
      where: { vin },
      relations: ['images'],
    });
  }
}
