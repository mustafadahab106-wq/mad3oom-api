import { DeletionRequestsService } from './deletion-requests.service';
export declare class DeletionRequestsController {
    private readonly deletionRequestsService;
    constructor(deletionRequestsService: DeletionRequestsService);
    findAll(): Promise<import("./deletion-request.entity").DeletionRequest[]>;
}
