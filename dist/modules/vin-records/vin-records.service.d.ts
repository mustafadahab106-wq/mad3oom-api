import { Repository } from 'typeorm';
import { VinRecord } from './vin-record.entity';
export declare class VinRecordsService {
    private repo;
    constructor(repo: Repository<VinRecord>);
    findByVin(vin: string): Promise<VinRecord>;
}
