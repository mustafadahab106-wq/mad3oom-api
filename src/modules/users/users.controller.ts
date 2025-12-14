import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.service.findAll();
  }
}
