"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletionRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const deletion_request_entity_1 = require("./deletion-request.entity");
const deletion_requests_service_1 = require("./deletion-requests.service");
const deletion_requests_controller_1 = require("./deletion-requests.controller");
let DeletionRequestsModule = class DeletionRequestsModule {
};
exports.DeletionRequestsModule = DeletionRequestsModule;
exports.DeletionRequestsModule = DeletionRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([deletion_request_entity_1.DeletionRequest])],
        providers: [deletion_requests_service_1.DeletionRequestsService],
        controllers: [deletion_requests_controller_1.DeletionRequestsController],
    })
], DeletionRequestsModule);
//# sourceMappingURL=deletion-requests.module.js.map