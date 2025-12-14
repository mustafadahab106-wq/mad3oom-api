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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinRecord = void 0;
const typeorm_1 = require("typeorm");
const vin_image_entity_1 = require("./vin-image.entity");
let VinRecord = class VinRecord {
};
exports.VinRecord = VinRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VinRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], VinRecord.prototype, "vin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VinRecord.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VinRecord.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VinRecord.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VinRecord.prototype, "auction_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VinRecord.prototype, "lot_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VinRecord.prototype, "sold_price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VinRecord.prototype, "damage_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vin_image_entity_1.VinImage, (img) => img.vinRecord, { cascade: true }),
    __metadata("design:type", Array)
], VinRecord.prototype, "images", void 0);
exports.VinRecord = VinRecord = __decorate([
    (0, typeorm_1.Entity)('vin_records')
], VinRecord);
//# sourceMappingURL=vin-record.entity.js.map