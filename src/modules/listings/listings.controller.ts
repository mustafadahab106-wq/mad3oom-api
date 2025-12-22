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
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async getListings(@Req() req: any) {
    return this.listingsService.findAll(req.query);
  }

  // ✅ هذا هو المهم
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 6))
  async createListing(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: any,
    @Req() req: any,
  ) {
    const userId = req.user.sub; // من JWT

    return this.listingsService.create({
      ...body,
      userId,
      images: images?.map((f) => f.filename) || [],
    });
  }
}
