import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async findAll(filters?: {
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    city?: string;
    damageType?: string;
    legalStatus?: string;
    search?: string;
    section?: string; // latest | featured | auction
  }): Promise<Listing[]> {
    const query = this.listingsRepository.createQueryBuilder('listing');

    query.where('listing.status = :status', { status: 'active' });

    if (filters?.section === 'featured') {
      query.andWhere('listing.isFeatured = :isFeatured', { isFeatured: true });
    } else if (filters?.section === 'auction') {
      query.andWhere('listing.auctionEnd IS NOT NULL');
    }

    if (filters?.make) query.andWhere('listing.make LIKE :make', { make: `%${filters.make}%` });
    if (filters?.model) query.andWhere('listing.model LIKE :model', { model: `%${filters.model}%` });
    if (filters?.minPrice) query.andWhere('listing.price >= :minPrice', { minPrice: filters.minPrice });
    if (filters?.maxPrice) query.andWhere('listing.price <= :maxPrice', { maxPrice: filters.maxPrice });
    if (filters?.minYear) query.andWhere('listing.year >= :minYear', { minYear: filters.minYear });
    if (filters?.maxYear) query.andWhere('listing.year <= :maxYear', { maxYear: filters.maxYear });
    if (filters?.city) query.andWhere('listing.city LIKE :city', { city: `%${filters.city}%` });
    if (filters?.damageType) query.andWhere('listing.damageType LIKE :damageType', { damageType: `%${filters.damageType}%` });
    if (filters?.legalStatus) query.andWhere('listing.legalStatus LIKE :legalStatus', { legalStatus: `%${filters.legalStatus}%` });

    if (filters?.search) {
      query.andWhere(
        '(listing.make LIKE :search OR listing.model LIKE :search OR listing.city LIKE :search OR listing.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('listing.createdAt', 'DESC');
    return query.getMany();
  }

  async findMyListings(userId: number): Promise<Listing[]> {
    return this.listingsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Listing | null> {
    const listing = await this.listingsRepository.findOne({ where: { id } });

    if (listing) {
      listing.views = (listing.views || 0) + 1;
      await this.listingsRepository.save(listing);
    }

    return listing;
  }

  async create(data: Partial<Listing>): Promise<Listing> {
    const listing = this.listingsRepository.create({
      ...data,
      status: 'active',
      views: 0,
      isFeatured: false,
    });
    return this.listingsRepository.save(listing);
  }

  async update(id: number, data: Partial<Listing>): Promise<Listing | null> {
    await this.listingsRepository.update(id, { ...data });
    return this.listingsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.listingsRepository.delete(id);
    return {
      success: (result.affected ?? 0) > 0,
      message: (result.affected ?? 0) > 0 ? 'تم حذف الإعلان بنجاح' : 'لم يتم العثور على الإعلان',
    };
  }

  async toggleStatus(id: number, status: 'active' | 'inactive' | 'sold' | 'pending'): Promise<Listing | null> {
    await this.listingsRepository.update(id, { status });
    return this.listingsRepository.findOne({ where: { id } });
  }

  async findSimilar(make: string, excludeId: number, limit = 4): Promise<Listing[]> {
    return this.listingsRepository.find({
      where: {
        make: Like(`%${make}%`),
        status: 'active',
        id: Not(excludeId),
      },
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(userId?: number): Promise<{
    total: number;
    active: number;
    sold: number;
    pending: number;
    featured: number;
    totalViews: number;
  }> {
    const listings = await this.listingsRepository.find({
      where: userId ? { userId } : {},
    });

    return {
      total: listings.length,
      active: listings.filter((l) => l.status === 'active').length,
      sold: listings.filter((l) => l.status === 'sold').length,
      pending: listings.filter((l) => l.status === 'pending').length,
      featured: listings.filter((l) => l.isFeatured).length,
      totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    };
  }
}
