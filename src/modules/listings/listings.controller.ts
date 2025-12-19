// src/modules/listings/listings.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing } from './entities/listing.entity';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async getListings(@Query('section') section?: string): Promise<Listing[]> {
    return this.listingsService.findAll({ section });
  }
}