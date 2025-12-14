import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinRecord } from './vin-record.entity';
import { VinRecordsService } from './vin-records.service';
import { VinRecordsController } from './vin-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VinRecord])],
  providers: [VinRecordsService],
  controllers: [VinRecordsController],
  exports: [VinRecordsService],
})
export class VinRecordsModule {}