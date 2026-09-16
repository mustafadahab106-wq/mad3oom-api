// src/modules/users/users.controller.ts - النسخة الصحيحة
import { Controller, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

function stripPassword(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll();
    return users.map(stripPassword);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(id);
    return stripPassword(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const { password, ...safeData } = userData;
    const user = await this.usersService.update(id, safeData);
    return stripPassword(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
