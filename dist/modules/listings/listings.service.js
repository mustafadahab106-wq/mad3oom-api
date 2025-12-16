"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const listing_entity_1 = require("./listing.entity");
let ListingsService = class ListingsService {
    constructor(listingsRepository) {
        this.listingsRepository = listingsRepository;
    }
    async findAll(filters) {
        const query = this.listingsRepository.createQueryBuilder('listing');
        query.where('listing.status = :status', { status: 'active' });
        if (filters?.section === 'featured') {
            query.andWhere('listing.isFeatured = :isFeatured', { isFeatured: true });
        }
        else if (filters?.section === 'auction') {
            query.andWhere('listing.auctionEnd IS NOT NULL');
        }
        if (filters?.make)
            query.andWhere('listing.make LIKE :make', { make: `%${filters.make}%` });
        if (filters?.model)
            query.andWhere('listing.model LIKE :model', { model: `%${filters.model}%` });
        if (filters?.minPrice)
            query.andWhere('listing.price >= :minPrice', { minPrice: filters.minPrice });
        if (filters?.maxPrice)
            query.andWhere('listing.price <= :maxPrice', { maxPrice: filters.maxPrice });
        if (filters?.minYear)
            query.andWhere('listing.year >= :minYear', { minYear: filters.minYear });
        if (filters?.maxYear)
            query.andWhere('listing.year <= :maxYear', { maxYear: filters.maxYear });
        if (filters?.city)
            query.andWhere('listing.city LIKE :city', { city: `%${filters.city}%` });
        if (filters?.damageType)
            query.andWhere('listing.damageType LIKE :damageType', { damageType: `%${filters.damageType}%` });
        if (filters?.legalStatus)
            query.andWhere('listing.legalStatus LIKE :legalStatus', { legalStatus: `%${filters.legalStatus}%` });
        if (filters?.search) {
            query.andWhere('(listing.make LIKE :search OR listing.model LIKE :search OR listing.city LIKE :search OR listing.description LIKE :search)', { search: `%${filters.search}%` });
        }
        query.orderBy('listing.createdAt', 'DESC');
        return query.getMany();
    }
    async findMyListings(userId) {
        return this.listingsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const listing = await this.listingsRepository.findOne({ where: { id } });
        if (listing) {
            listing.views = (listing.views || 0) + 1;
            await this.listingsRepository.save(listing);
        }
        return listing;
    }
    async create(data) {
        const listing = this.listingsRepository.create({
            ...data,
            status: 'active',
            views: 0,
            isFeatured: false,
        });
        return this.listingsRepository.save(listing);
    }
    async update(id, data) {
        await this.listingsRepository.update(id, { ...data });
        return this.listingsRepository.findOne({ where: { id } });
    }
    async remove(id) {
        const result = await this.listingsRepository.delete(id);
        return {
            success: (result.affected ?? 0) > 0,
            message: (result.affected ?? 0) > 0 ? 'تم حذف الإعلان بنجاح' : 'لم يتم العثور على الإعلان',
        };
    }
    async toggleStatus(id, status) {
        await this.listingsRepository.update(id, { status });
        return this.listingsRepository.findOne({ where: { id } });
    }
    async findSimilar(make, excludeId, limit = 4) {
        return this.listingsRepository.find({
            where: {
                make: (0, typeorm_2.Like)(`%${make}%`),
                status: 'active',
                id: (0, typeorm_2.Not)(excludeId),
            },
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
    async getStats(userId) {
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
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(listing_entity_1.Listing)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ListingsService);
//# sourceMappingURL=listings.service.js.map