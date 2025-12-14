import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm'; // استخدم Not بدلاً من excludeId
import { Listing } from './listing.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  // ✅ جلب جميع الإعلانات مع فلترة
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
    section?: string; // 'latest', 'featured', 'auction'
  }): Promise<Listing[]> {
    const query = this.listingsRepository.createQueryBuilder('listing');

    // فقط الإعلانات النشطة
    query.where('listing.status = :status', { status: 'active' });

    if (filters) {
      // فلترة حسب القسم
      if (filters.section) {
        if (filters.section === 'featured') {
          query.andWhere('listing.isFeatured = :isFeatured', { isFeatured: true });
        } else if (filters.section === 'auction') {
          query.andWhere('listing.auctionEnd IS NOT NULL');
        }
        // 'latest' يتم التعامل معه بالترتيب الافتراضي (أحدث أولاً)
      }

      if (filters.make) {
        query.andWhere('listing.make LIKE :make', { make: `%${filters.make}%` });
      }
      
      if (filters.model) {
        query.andWhere('listing.model LIKE :model', { model: `%${filters.model}%` });
      }
      
      if (filters.minPrice) {
        query.andWhere('listing.price >= :minPrice', { minPrice: filters.minPrice });
      }
      
      if (filters.maxPrice) {
        query.andWhere('listing.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      
      if (filters.minYear) {
        query.andWhere('listing.year >= :minYear', { minYear: filters.minYear });
      }
      
      if (filters.maxYear) {
        query.andWhere('listing.year <= :maxYear', { maxYear: filters.maxYear });
      }
      
      if (filters.city) {
        query.andWhere('listing.city LIKE :city', { city: `%${filters.city}%` });
      }
      
      if (filters.damageType) {
        query.andWhere('listing.damageType LIKE :damageType', { 
          damageType: `%${filters.damageType}%` 
        });
      }
      
      if (filters.legalStatus) {
        query.andWhere('listing.legalStatus LIKE :legalStatus', { 
          legalStatus: `%${filters.legalStatus}%` 
        });
      }
      
      if (filters.search) {
        query.andWhere(
          '(listing.make LIKE :search OR listing.model LIKE :search OR listing.city LIKE :search OR listing.description LIKE :search)',
          { search: `%${filters.search}%` }
        );
      }
    }
    
    query.orderBy('listing.createdAt', 'DESC');
    
    return await query.getMany();
  }

  // ✅ إعلاناتي - جلب إعلانات مستخدم معين
  async findMyListings(userId: number): Promise<Listing[]> {
    return await this.listingsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ جلب إعلان واحد
  async findOne(id: number): Promise<Listing | null> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (listing) {
      // زيادة عدد المشاهدات
      listing.views = (listing.views || 0) + 1;
      await this.listingsRepository.save(listing);
    }
    
    return listing;
  }

  // ✅ إنشاء إعلان جديد
  async create(data: Partial<Listing>): Promise<Listing> {
    const listing = this.listingsRepository.create({
      ...data,
      status: 'active',
      views: 0,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.listingsRepository.save(listing);
  }

  // ✅ تحديث إعلان
  async update(id: number, data: Partial<Listing>): Promise<Listing | null> {
    await this.listingsRepository.update(id, {
      ...data,
      updatedAt: new Date(),
    });
    return await this.findOne(id);
  }

  // ✅ حذف إعلان
  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.listingsRepository.delete(id);
    return { 
      success: result.affected > 0,
      message: result.affected > 0 ? 'تم حذف الإعلان بنجاح' : 'لم يتم العثور على الإعلان'
    };
  }

  // ✅ تعطيل/تفعيل إعلان
  async toggleStatus(id: number, status: 'active' | 'inactive' | 'sold' | 'pending'): Promise<Listing | null> {
    await this.listingsRepository.update(id, { 
      status,
      updatedAt: new Date(),
    });
    return await this.findOne(id);
  }

  // ✅ إعلانات مشابهة - محسنة باستخدام Not
  async findSimilar(make: string, excludeId: number, limit: number = 4): Promise<Listing[]> {
    return await this.listingsRepository.find({
      where: { 
        make: Like(`%${make}%`),
        status: 'active',
        id: Not(excludeId), // استخدام Not لاستبعاد الإعلان الحالي
      },
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ زيادة المشاهدات
  async incrementViews(id: number): Promise<void> {
    await this.listingsRepository.increment({ id }, 'views', 1);
  }

  // ✅ الإعلانات المميزة
  async findFeatured(limit: number = 10): Promise<Listing[]> {
    return await this.listingsRepository.find({
      where: { 
        isFeatured: true,
        status: 'active',
      },
      take: limit,
      order: { featuredAt: 'DESC' },
    });
  }

  // ✅ الإعلانات الجديدة
  async findLatest(limit: number = 20): Promise<Listing[]> {
    return await this.listingsRepository.find({
      where: { status: 'active' },
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ إحصائيات الإعلانات
  async getStats(userId?: number): Promise<{
    total: number;
    active: number;
    sold: number;
    pending: number;
    featured: number;
    totalViews: number;
  }> {
    const query = this.listingsRepository.createQueryBuilder('listing');
    
    if (userId) {
      query.where('listing.userId = :userId', { userId });
    }

    const listings = await query.getMany();
    
    return {
      total: listings.length,
      active: listings.filter(l => l.status === 'active').length,
      sold: listings.filter(l => l.status === 'sold').length,
      pending: listings.filter(l => l.status === 'pending').length,
      featured: listings.filter(l => l.isFeatured).length,
      totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    };
  }

  // ✅ البحث المتقدم
  async searchAdvanced(criteria: {
    make?: string;
    model?: string;
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    cities?: string[];
    damageTypes?: string[];
    legalStatuses?: string[];
    hasImages?: boolean;
    sortBy?: 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'newest';
  }): Promise<Listing[]> {
    const query = this.listingsRepository.createQueryBuilder('listing');
    
    query.where('listing.status = :status', { status: 'active' });

    if (criteria.make) {
      query.andWhere('listing.make LIKE :make', { make: `%${criteria.make}%` });
    }

    if (criteria.model) {
      query.andWhere('listing.model LIKE :model', { model: `%${criteria.model}%` });
    }

    if (criteria.minYear) {
      query.andWhere('listing.year >= :minYear', { minYear: criteria.minYear });
    }

    if (criteria.maxYear) {
      query.andWhere('listing.year <= :maxYear', { maxYear: criteria.maxYear });
    }

    if (criteria.minPrice) {
      query.andWhere('listing.price >= :minPrice', { minPrice: criteria.minPrice });
    }

    if (criteria.maxPrice) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice: criteria.maxPrice });
    }

    if (criteria.cities && criteria.cities.length > 0) {
      query.andWhere('listing.city IN (:...cities)', { cities: criteria.cities });
    }

    if (criteria.damageTypes && criteria.damageTypes.length > 0) {
      query.andWhere('listing.damageType IN (:...damageTypes)', { 
        damageTypes: criteria.damageTypes 
      });
    }

    if (criteria.legalStatuses && criteria.legalStatuses.length > 0) {
      query.andWhere('listing.legalStatus IN (:...legalStatuses)', { 
        legalStatuses: criteria.legalStatuses 
      });
    }

    if (criteria.hasImages) {
      query.andWhere('listing.images IS NOT NULL');
      query.andWhere('listing.images != :emptyArray', { emptyArray: '[]' });
    }

    // الترتيب
    if (criteria.sortBy) {
      switch (criteria.sortBy) {
        case 'price_asc':
          query.orderBy('listing.price', 'ASC');
          break;
        case 'price_desc':
          query.orderBy('listing.price', 'DESC');
          break;
        case 'year_asc':
          query.orderBy('listing.year', 'ASC');
          break;
        case 'year_desc':
          query.orderBy('listing.year', 'DESC');
          break;
        case 'newest':
        default:
          query.orderBy('listing.createdAt', 'DESC');
          break;
      }
    } else {
      query.orderBy('listing.createdAt', 'DESC');
    }

    return await query.getMany();
  }
}