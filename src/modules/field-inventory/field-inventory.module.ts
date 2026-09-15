import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsModule } from '../listings/listings.module';
import { MediaModule } from '../media/media.module';
import { FieldInventoryController } from './field-inventory.controller';
import { FieldInventoryService } from './field-inventory.service';
import { FieldVehicle } from './entities/field-vehicle.entity';
import { Scrapyard } from './entities/scrapyard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldVehicle, Scrapyard]), ListingsModule, MediaModule],
  controllers: [FieldInventoryController],
  providers: [FieldInventoryService],
  exports: [FieldInventoryService],
})
export class FieldInventoryModule {}
