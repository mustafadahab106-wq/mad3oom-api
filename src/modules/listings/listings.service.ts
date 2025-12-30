// src/modules/listings/listings.service.ts
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

  private getSingleListing(saved: Listing | Listing[]): Listing {
    return Array.isArray(saved) ? saved[0] : saved;
  }

  private parseImages(images: any): string[] {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
    return [];
  }

  async findAll(filters?: any): Promise<any[]> {
    const listings = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return listings.map((l) => ({
      ...l,
      images: this.parseImages(l.images),
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
      images: JSON.stringify(imagesArr), // تخزين كـ JSON string
    });

    const saved = await this.repo.save(listing);
    const savedListing = this.getSingleListing(saved);

    return {
      data: {
        ...savedListing,
        images: this.parseImages(savedListing.images),
      },
    };
  }

  async findOne(id: number) {
    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException(`Listing #${id} not found`);

    return {
      data: {
        ...listing,
        images: this.parseImages(listing.images),
      },
    };
  }

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
      // 🔴 الحل: استخدم type assertion
      (listing as any).images = JSON.stringify(imagesArr);
    }

    const saved = await this.repo.save(listing);
    const savedListing = this.getSingleListing(saved);

    return {
      data: {
        ...savedListing,
        images: this.parseImages(savedListing.images),
      },
    };
  }

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
      images: this.parseImages(l.images),
    }));
  }
}