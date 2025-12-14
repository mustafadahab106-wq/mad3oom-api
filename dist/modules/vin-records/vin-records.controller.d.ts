import { VinRecordsService } from './vin-records.service';
export declare class VinRecordsController {
    private readonly service;
    constructor(service: VinRecordsService);
    search(vin: string): Promise<import("./vin-record.entity").VinRecord>;
}
