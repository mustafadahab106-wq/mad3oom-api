import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { UpdateListingDto } from './dto/update-listing.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: any) {
    const userId = Number(req.user?.userId);
    if (!userId) throw new UnauthorizedException('Invalid token payload');
    return this.listingsService.findByUserId(userId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.listingsService.findByUserId(+userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  async create(
    @UploadedFiles() files: any[],
    @Body() createListingDto: any,
    @Req() req: any,
  ) {
    const userId = Number(req.user?.userId);
    if (!userId) throw new UnauthorizedException('Invalid token payload');

    const uploadedUrls = files?.map((f) => `/uploads/${f.filename}`) || [];

    const bodyImages = createListingDto.images
      ? Array.isArray(createListingDto.images)
        ? createListingDto.images
        : [createListingDto.images]
      : [];

    const images = [...uploadedUrls, ...bodyImages].filter(Boolean);

    return this.listingsService.createWithImages({ ...createListingDto, images }, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateListingDto, @Req() req: any) {
    const userId = Number(req.user?.userId);
    if (!userId) throw new UnauthorizedException('Invalid token payload');
    return this.listingsService.update(+id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = Number(req.user?.userId);
    if (!userId) throw new UnauthorizedException('Invalid token payload');
    return this.listingsService.remove(+id, userId);
  }
}
