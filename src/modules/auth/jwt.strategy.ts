import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config'; // علق مؤقتاً

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() { // removed ConfigService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'temporary-secret-key', // قيمة مباشرة
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}