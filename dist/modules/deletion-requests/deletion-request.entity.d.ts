export declare class DeletionRequest {
    id: number;
    listingId: number;
    userId: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}
