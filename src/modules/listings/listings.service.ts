import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { UpdateListingDto } from './dto/update-listing.dto';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private repo: Repository<Listing>,
  ) {}

  async findAll(filters?: any): Promise<Listing[]> {
    const listings = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    // images أصبحت jsonb array، ما نحتاج parse
    return listings.map((l) => ({
      ...l,
      images: l.images ?? [],
    }));
  }

  async createWithImages(
    createListingDto: CreateListingDto & { images?: string[] | string },
    userId: number,
  ) {
    const imagesArr = Array.isArray(createListingDto.images)
      ? createListingDto.images
      : createListingDto.images
      ? [createListingDto.images]
      : [];

    const computedTitle =
      (createListingDto as any).title?.trim() ||
      `${createListingDto.make || ''} ${createListingDto.model || ''} ${
        (createListingDto as any).year || ''
      }`.trim() ||
      'Listing';

    const listing = this.repo.create({
      ...(createListingDto as any),
      title: computedTitle,
      userId,
      images: imagesArr, // ✅ jsonb array
    });

    const saved = await this.repo.save(listing);

    return {
      data: {
        ...saved,
        images: saved.images ?? [],
      },
    };
  }

  async findOne(id: number) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException(`Listing #${id} not found`);

    return {
      data: {
        ...listing,
        images: listing.images ?? [],
      },
    };
  }

  // ✅ (1) حماية التعديل: فقط صاحب الإعلان
  async update(id: number, dto: UpdateListingDto, userId: number) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException(`Listing #${id} not found`);

    if (listing.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this listing');
    }

    const { images, ...rest } = dto as any;
    Object.assign(listing, rest);

    if (images !== undefined) {
      const imagesArr = Array.isArray(images) ? images : [images];
      listing.images = imagesArr; // ✅ array مباشرة
    }

    const saved = await this.repo.save(listing);

    return {
      data: {
        ...saved,
        images: saved.images ?? [],
      },
    };
  }

  // ✅ (1) حماية الحذف: فقط صاحب الإعلان
  async remove(id: number, userId: number) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException(`Listing #${id} not found`);

    if (listing.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this listing');
    }

    await this.repo.delete(id);
    return { ok: true };
  }

  async findByUserId(userId: number) {
    const listings = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return listings.map((l) => ({
      ...l,
      images: l.images ?? [],
    }));
  }
}
