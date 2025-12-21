import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule, // ✅ مهم عشان UsersService
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'temporary-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController], // ✅ هذا كان ناقص
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // ✅ أضف AuthService
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
