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
        if (filters) {
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
                query.andWhere('(listing.make LIKE :search OR listing.model LIKE :search OR listing.city LIKE :search)', { search: `%${filters.search}%` });
            }
        }
        query.orderBy('listing.createdAt', 'DESC');
        return await query.getMany();
    }
    async findOne(id) {
        const listing = await this.listingsRepository.findOne({ where: { id } });
        if (listing) {
            listing.views += 1;
            await this.listingsRepository.save(listing);
        }
        return listing;
    }
    async create(data) {
        const listing = this.listingsRepository.create(data);
        return await this.listingsRepository.save(listing);
    }
    async update(id, data) {
        await this.listingsRepository.update(id, data);
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.listingsRepository.delete(id);
        return { success: result.affected > 0 };
    }
    async findSimilar(make, excludeId, limit = 4) {
        return await this.listingsRepository.find({
            where: {
                make: (0, typeorm_2.Like)(`%${make}%`),
                id: excludeId ? excludeId : undefined
            },
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
    async incrementViews(id) {
        await this.listingsRepository.increment({ id }, 'views', 1);
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(listing_entity_1.Listing)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ListingsService);
//# sourceMappingURL=listings.service.js.map