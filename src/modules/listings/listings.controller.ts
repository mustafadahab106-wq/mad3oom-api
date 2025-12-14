import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing } from './listing.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // ✅ جلب جميع الإعلانات
  @Get()
  async findAll(@Query() filters: any) {
    const listings = await this.listingsService.findAll(filters);
    return { success: true, data: listings, count: listings.length };
  }

  // ✅ إعلاناتي (لازم تكون قبل :id)
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyListings(@Req() req: any) {
    const userId = req.user.id;
    const listings = await this.listingsService.findMyListings(userId);
    return { success: true, data: listings, count: listings.length };
  }

  // ✅ إحصائيات (لازم تكون قبل :id)
  @Get('stats/my')
  @UseGuards(JwtAuthGuard)
  async getMyStats(@Req() req: any) {
    const stats = await this.listingsService.getStats(req.user.id);
    return { success: true, data: stats };
  }

  // ✅ إعلانات مشابهة (لازم تكون قبل :id)
  @Get(':id/similar')
  async getSimilar(@Param('id', ParseIntPipe) id: number) {
    const listing = await this.listingsService.findOne(id);
    if (!listing) return { success: false, message: 'لم يتم العثور على الإعلان' };

    const similar = await this.listingsService.findSimilar(listing.make, id, 4);
    return { success: true, data: similar };
  }

  // ✅ جلب إعلان واحد (خليه في النهاية)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const listing = await this.listingsService.findOne(id);
    if (!listing) return { success: false, message: 'لم يتم العثور على الإعلان' };
    return { success: true, data: listing };
  }

  // ✅ إنشاء إعلان جديد
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: Partial<Listing>, @Req() req: any) {
    const listing = await this.listingsService.create({
      ...data,
      userId: req.user.id,
    });
    return { success: true, data: listing, message: 'تم إنشاء الإعلان بنجاح' };
  }

  // ✅ تحديث إعلان
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Listing>,
    @Req() req: any,
  ) {
    const listing = await this.listingsService.findOne(id);
    if (!listing) return { success: false, message: 'لم يتم العثور على الإعلان' };

    if (listing.userId !== req.user.id) {
      return { success: false, message: 'ليس لديك صلاحية لتعديل هذا الإعلان' };
    }

    const updated = await this.listingsService.update(id, data);
    return { success: true, data: updated, message: 'تم تحديث الإعلان بنجاح' };
  }

  // ✅ حذف إعلان
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const listing = await this.listingsService.findOne(id);
    if (!listing) return { success: false, message: 'لم يتم العثور على الإعلان' };

    if (listing.userId !== req.user.id) {
      return { success: false, message: 'ليس لديك صلاحية لحذف هذا الإعلان' };
    }

    const result = await this.listingsService.remove(id);
    return { success: result.success, message: result.message };
  }
}
