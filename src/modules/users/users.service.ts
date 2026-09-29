import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });
    
    return await this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, {
      ...userData,
      updatedAt: new Date(),
    });
    
    return await this.findOne(id);
  }

  async updateProfile(id: number, input: Record<string, unknown>): Promise<User> {
    const user = await this.findOne(id);
    if (input.name !== undefined) {
      if (typeof input.name !== 'string' || input.name.trim().length < 2 || input.name.trim().length > 100)
        throw new BadRequestException('Name must be 2-100 characters');
      user.name = input.name.trim();
    }
    if (input.phone !== undefined) {
      if (typeof input.phone !== 'string' || (input.phone.trim() && !/^\\+?[0-9 -]{7,30}$/.test(input.phone.trim())))
        throw new BadRequestException('Invalid phone number');
      user.phone = input.phone.trim() || null;
    }
    if (input.city !== undefined) {
      if (typeof input.city !== 'string' || input.city.trim().length > 100)
        throw new BadRequestException('City must be at most 100 characters');
      user.city = input.city.trim() || null;
    }
    if (input.password !== undefined) {
      if (typeof input.password !== 'string' || input.password.length < 8)
        throw new BadRequestException('Password must be at least 8 characters');
      if (typeof input.currentPassword !== 'string' || !input.currentPassword)
        throw new BadRequestException('Current password is required');
      const stored = user.password || '';
      const matches = stored.startsWith('$2') ? await bcrypt.compare(input.currentPassword, stored) : stored === input.currentPassword;
      if (!matches) throw new UnauthorizedException('Current password is incorrect');
      user.password = await bcrypt.hash(input.password, 10);
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async deactivate(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    user.updatedAt = new Date();
    
    return await this.usersRepository.save(user);
  }
}
