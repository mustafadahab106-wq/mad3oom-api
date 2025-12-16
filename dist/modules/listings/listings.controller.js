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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
let ListingsController = class ListingsController {
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    findAll(section, make, model, minPrice, maxPrice, minYear, maxYear, city, damageType, legalStatus, search, category) {
        const filters = {
            ...(section && { section }),
            ...(make && { make }),
            ...(model && { model }),
            ...(minPrice && { minPrice: parseFloat(minPrice) }),
            ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
            ...(minYear && { minYear: parseInt(minYear) }),
            ...(maxYear && { maxYear: parseInt(maxYear) }),
            ...(city && { city }),
            ...(damageType && { damageType }),
            ...(legalStatus && { legalStatus }),
            ...(search && { search }),
            ...(category && { make: category }),
        };
        return this.listingsService.findAll(filters);
    }
    create(listingData) {
        return this.listingsService.create(listingData);
    }
    findOne(id) {
        return this.listingsService.findOne(id);
    }
    update(id, listingData) {
        return this.listingsService.update(id, listingData);
    }
    remove(id) {
        return this.listingsService.remove(id);
    }
    findMyListings(userId) {
        return this.listingsService.findMyListings(userId);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('section')),
    __param(1, (0, common_1.Query)('make')),
    __param(2, (0, common_1.Query)('model')),
    __param(3, (0, common_1.Query)('minPrice')),
    __param(4, (0, common_1.Query)('maxPrice')),
    __param(5, (0, common_1.Query)('minYear')),
    __param(6, (0, common_1.Query)('maxYear')),
    __param(7, (0, common_1.Query)('city')),
    __param(8, (0, common_1.Query)('damageType')),
    __param(9, (0, common_1.Query)('legalStatus')),
    __param(10, (0, common_1.Query)('search')),
    __param(11, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "findMyListings", null);
exports.ListingsController = ListingsController = __decorate([
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map