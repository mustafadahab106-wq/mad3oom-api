export declare class User {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    passwordHash: string;
    role: 'user' | 'admin';
    city?: string;
    listingsCount: number;
    favoritesCount: number;
    avatar?: string;
    isVerified: boolean;
    verificationCode?: string;
    verificationExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}
