// src/modules/vin-records/vin-records.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinRecord } from './entities/vin-record.entity';
import { VinRecordsService } from './vin-records.service';
import { VinRecordsController } from './vin-records.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VinRecord]), // 🟢 سجّل VinRecord هنا
  ],
  controllers: [VinRecordsController],
  providers: [VinRecordsService],
  exports: [VinRecordsService],
})
export class VinRecordsModule {}
