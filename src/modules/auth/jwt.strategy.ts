import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'temporary-secret-key', // قيمة مباشرة
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(Number(payload.sub)).catch(() => null);
    if (!user) throw new UnauthorizedException();
    return { userId: user.id, email: user.email, isAdmin: !!user.isAdmin };
  }
}
