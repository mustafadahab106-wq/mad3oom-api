import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { CloudinaryService } from '../media/cloudinary.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private repo: Repository<Listing>,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll(query: any) {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async createWithImages(payload: {
    userId: number;
    images: Array<Express.Multer.File>;
    [key: string]: any;
  }) {
    const { images, userId, ...body } = payload;

    if (!images?.length) {
      throw new BadRequestException('At least one image is required');
    }

    // رفع الصور للـ Cloudinary
    const uploaded = await Promise.all(
      images.map((file) => this.cloudinary.uploadBuffer(file.buffer)),
    );

    const imageUrls = uploaded.map((u) => u.secure_url);

    // احفظ في DB (عدّل حسب entity عندك)
    const listing = this.repo.create({
      ...body,
      userId,
      images: imageUrls, // الأفضل تخزين روابط
    });

    const saved = await this.repo.save(listing);
    return { data: saved };
  }
}
