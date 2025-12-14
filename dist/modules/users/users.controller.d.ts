import { UsersService } from './users.service';
import { User } from './user.entity';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    getAll(): Promise<User[]>;
}
