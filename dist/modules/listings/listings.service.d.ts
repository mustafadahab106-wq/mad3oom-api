import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
export declare class ListingsService {
    private listingsRepository;
    constructor(listingsRepository: Repository<Listing>);
    findAll(filters?: {
        make?: string;
        model?: string;
        minPrice?: number;
        maxPrice?: number;
        minYear?: number;
        maxYear?: number;
        city?: string;
        damageType?: string;
        legalStatus?: string;
        search?: string;
    }): Promise<Listing[]>;
    findOne(id: number): Promise<Listing | null>;
    create(data: Partial<Listing>): Promise<Listing>;
    update(id: number, data: Partial<Listing>): Promise<Listing | null>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
    findSimilar(make: string, excludeId: number, limit?: number): Promise<Listing[]>;
    incrementViews(id: number): Promise<void>;
}
