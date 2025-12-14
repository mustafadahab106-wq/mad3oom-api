import { VinImage } from './vin-image.entity';
export declare class VinRecord {
    id: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    auction_name: string;
    lot_number: string;
    sold_price: number;
    damage_type: string;
    images: VinImage[];
}
