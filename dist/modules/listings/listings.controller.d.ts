import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing } from './listing.entity';
export declare class ListingsController {
    private readonly service;
    constructor(service: ListingsService);
    getAll(): Promise<Listing[]>;
    getOne(id: number): Promise<Listing | null>;
    create(body: CreateListingDto): Promise<Listing>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
