import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

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
    return (await this.usersService.findAll()).map(stripPassword);
  }

  @Get('me')
  async me(@Req() req: any): Promise<Omit<User, 'password'>> {
    return stripPassword(await this.usersService.findOne(Number(req.user.userId)));
  }

  @Patch('me')
  async updateMe(@Body() body: Record<string, unknown>, @Req() req: any): Promise<Omit<User, 'password'>> {
    const allowed = ['name', 'phone', 'city', 'password', 'currentPassword'];
    if (Object.keys(body).some(key => !allowed.includes(key))) throw new BadRequestException('Unsupported profile field');
    return stripPassword(await this.usersService.updateProfile(Number(req.user.userId), body));
  }

  @Get('public/:id')
  async getPublicById(@Param('id') id: number): Promise<{ id: number; name?: string }> {
    const user = await this.usersService.findOne(Number(id));
    return { id: user.id, name: user.name };
  }

  @Get(':id')
  async getById(@Param('id') id: number, @Req() req: any): Promise<Omit<User, 'password'>> {
    if (!req.user?.isAdmin && Number(req.user?.userId) !== Number(id)) throw new UnauthorizedException('Not allowed');
    return stripPassword(await this.usersService.findOne(Number(id)));
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>, @Req() req: any): Promise<Omit<User, 'password'>> {
    if (!req.user?.isAdmin && Number(req.user?.userId) !== Number(id)) throw new UnauthorizedException('Not allowed');
    const { password, isAdmin, ...safeData } = userData;
    const updateData = req.user?.isAdmin ? { ...safeData, ...(isAdmin !== undefined ? { isAdmin } : {}) } : safeData;
    return stripPassword(await this.usersService.update(Number(id), updateData));
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(Number(id));
  }
}
