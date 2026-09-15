
import {
  Body,
  UploadedFiles,
  UseInterceptors,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../media/cloudinary.service';
import { CreateFieldVehicleDto } from './dto/create-field-vehicle.dto';
import { CreateScrapyardDto } from './dto/create-scrapyard.dto';
import { QuickCaptureDto } from './dto/quick-capture.dto';
import { UpdateFieldVehicleDto } from './dto/update-field-vehicle.dto';
import { FieldInventoryStatus } from './entities/field-vehicle.entity';
import { FieldInventoryService } from './field-inventory.service';

@Controller('field-inventory')
@UseGuards(JwtAuthGuard, AdminGuard)
export class FieldInventoryController {
  constructor(
    private readonly service: FieldInventoryService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private userId(req: any) {
    const userId = Number(req.user?.userId);
    if (!userId) throw new UnauthorizedException('Invalid token payload');
    return userId;
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('scrapyards')
  listScrapyards() {
    return this.service.listScrapyards();
  }

  @Post('scrapyards')
  createScrapyard(@Body() dto: CreateScrapyardDto, @Req() req: any) {
    return this.service.createScrapyard(dto, this.userId(req));
  }

  @Get('vehicles')
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('vehicles/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post('vehicles/quick')
  @UseInterceptors(FilesInterceptor('images', 6))
  async quickCapture(
    @UploadedFiles() files: any[],
    @Body() dto: QuickCaptureDto,
    @Req() req: any,
  ) {
    const uploaded = files?.length
      ? await Promise.all(files.map((f) => this.cloudinary.uploadBuffer(f.buffer, 'mad3ooma/field-inventory')))
      : [];
    const urls = uploaded.map((x) => x.secure_url);
    return this.service.quickCapture({ ...dto, images: urls }, this.userId(req));
  }

  @Post('vehicles')
  @UseInterceptors(FilesInterceptor('images', 6))
  async create(
    @UploadedFiles() files: any[],
    @Body() dto: CreateFieldVehicleDto,
    @Req() req: any,
  ) {
    const uploaded = files?.length
      ? await Promise.all(files.map((f) => this.cloudinary.uploadBuffer(f.buffer, 'mad3ooma/field-inventory')))
      : [];
    const urls = uploaded.map((x) => x.secure_url);
    return this.service.createVehicle({ ...dto, images: urls }, this.userId(req));
  }

  @Patch('vehicles/:id')
  update(@Param('id') id: string, @Body() dto: UpdateFieldVehicleDto) {
    return this.service.update(+id, dto);
  }

  @Post('vehicles/:id/confirm')
  confirm(@Param('id') id: string) {
    return this.service.confirmAvailability(+id);
  }

  @Post('vehicles/:id/status')
  status(
    @Param('id') id: string,
    @Body('status') status: FieldInventoryStatus,
  ) {
    return this.service.markStatus(+id, status);
  }

  @Post('vehicles/:id/publish')
  publish(@Param('id') id: string, @Req() req: any) {
    return this.service.publish(+id, this.userId(req));
  }
}
