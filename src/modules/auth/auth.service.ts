import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const plainPassword = (password || '').trim();

    if (!normalizedEmail || !plainPassword) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.usersService.findByEmail(normalizedEmail);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hash = await bcrypt.hash(plainPassword, 10);

    const user = await this.usersService.create({
      email: normalizedEmail,
      password: hash,
      name: name ?? null,
    });

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: { id: user.id, email: user.email, name: user.name ?? null },
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const plainPassword = (password || '').trim();

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const storedPassword = (user.password || '').toString();

    let ok = false;
    if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
      ok = await bcrypt.compare(plainPassword, storedPassword);
    } else {
      // fallback لو عندك بيانات قديمة plain
      ok = storedPassword === plainPassword;
    }

    if (!ok) throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: { id: user.id, email: user.email, name: user.name ?? null },
    };
  }
}
