import { ListingsService } from './listings.service';
import { Listing } from './listing.entity';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    findAll(section?: string, make?: string, model?: string, minPrice?: string, maxPrice?: string, minYear?: string, maxYear?: string, city?: string, damageType?: string, legalStatus?: string, search?: string, category?: string): Promise<Listing[]>;
    create(listingData: Partial<Listing>): Promise<Listing>;
    findOne(id: number): Promise<Listing>;
    update(id: number, listingData: Partial<Listing>): Promise<Listing>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    findMyListings(userId: number): Promise<Listing[]>;
}
