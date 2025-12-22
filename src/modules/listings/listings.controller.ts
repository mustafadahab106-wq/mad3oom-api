import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async getListings(@Req() req: any) {
    return this.listingsService.findAll(req.query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 }, // 8MB لكل صورة
    }),
  )
  async createListing(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() body: any,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    return this.listingsService.createWithImages({
      ...body,
      userId,
      images,
    });
  }
}
