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
exports.DeletionRequestsController = void 0;
const common_1 = require("@nestjs/common");
const deletion_requests_service_1 = require("./deletion-requests.service");
let DeletionRequestsController = class DeletionRequestsController {
    constructor(deletionRequestsService) {
        this.deletionRequestsService = deletionRequestsService;
    }
    findAll() {
        return this.deletionRequestsService.findAll();
    }
};
exports.DeletionRequestsController = DeletionRequestsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeletionRequestsController.prototype, "findAll", null);
exports.DeletionRequestsController = DeletionRequestsController = __decorate([
    (0, common_1.Controller)('deletion-requests'),
    __metadata("design:paramtypes", [deletion_requests_service_1.DeletionRequestsService])
], DeletionRequestsController);
//# sourceMappingURL=deletion-requests.controller.js.map