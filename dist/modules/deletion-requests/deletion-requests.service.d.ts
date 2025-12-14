import { Repository } from 'typeorm';
import { DeletionRequest } from './deletion-request.entity';
export declare class DeletionRequestsService {
    private deletionRequestRepository;
    constructor(deletionRequestRepository: Repository<DeletionRequest>);
    findAll(): Promise<DeletionRequest[]>;
}
