import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly repo;
    constructor(repo: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
