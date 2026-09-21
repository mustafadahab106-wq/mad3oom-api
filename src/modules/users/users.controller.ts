// src/modules/users/users.controller.ts - النسخة الصحيحة
import { Controller, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Req, UnauthorizedException } from '@nestjs/common';

function stripPassword(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll();
    return users.map(stripPassword);
  }

  @Get(':id')
  async getById(@Param('id') id: number, @Req() req: any): Promise<Omit<User, 'password'>> {
    if (!req.user?.isAdmin && Number(req.user?.userId) !== Number(id)) throw new UnauthorizedException('Not allowed');
    const user = await this.usersService.findOne(id);
    return stripPassword(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
    @Req() req: any,
  ): Promise<Omit<User, 'password'>> {
    if (!req.user?.isAdmin && Number(req.user?.userId) !== Number(id)) throw new UnauthorizedException('Not allowed');
    const { password, isAdmin, ...safeData } = userData;
    const updateData = req.user?.isAdmin ? { ...safeData, ...(isAdmin !== undefined ? { isAdmin } : {}) } : safeData;
    const user = await this.usersService.update(id, updateData);
    return stripPassword(user);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
