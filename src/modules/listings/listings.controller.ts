import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // علق مؤقتاً
import { ListingsService } from './listings.service';
import { Listing } from './listing.entity';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  // @UseGuards(JwtAuthGuard) // علق مؤقتاً
  findAll(
    @Query('section') section?: string,
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minYear') minYear?: string,
    @Query('maxYear') maxYear?: string,
    @Query('city') city?: string,
    @Query('damageType') damageType?: string,
    @Query('legalStatus') legalStatus?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const filters = {
      ...(section && { section }),
      ...(make && { make }),
      ...(model && { model }),
      ...(minPrice && { minPrice: parseFloat(minPrice) }),
      ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      ...(minYear && { minYear: parseInt(minYear) }),
      ...(maxYear && { maxYear: parseInt(maxYear) }),
      ...(city && { city }),
      ...(damageType && { damageType }),
      ...(legalStatus && { legalStatus }),
      ...(search && { search }),
      ...(category && { make: category }), // استخدام category كـ make
    };
    
    return this.listingsService.findAll(filters);
  }
// @UseGuards(JwtAuthGuard) // علق مؤقتاً
  @Post()
  create(@Body() listingData: Partial<Listing>) {
    return this.listingsService.create(listingData);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard) // علق مؤقتاً
  findOne(@Param('id') id: number) {
    return this.listingsService.findOne(id);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard) // علق مؤقتاً
  update(@Param('id') id: number, @Body() listingData: Partial<Listing>) {
    return this.listingsService.update(id, listingData);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // علق مؤقتاً
  remove(@Param('id') id: number) {
    return this.listingsService.remove(id);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard) // علق مؤقتاً
  findMyListings(@Param('userId') userId: number) {
    return this.listingsService.findMyListings(userId);
  }
}