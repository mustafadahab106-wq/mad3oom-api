import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock; create: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn(), create: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('fake-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('rejects registration when email or password is missing', async () => {
      await expect(service.register('', 'password')).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.register('a@b.com', '')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects registration when the email is already in use', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 1, email: 'taken@mad3oom.com' });
      await expect(service.register('taken@mad3oom.com', 'password123')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('creates a user with a hashed password and returns a token', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({
        id: 5,
        email: 'new@mad3oom.com',
        name: 'Test User',
        isAdmin: false,
      });

      const result = await service.register('New@Mad3oom.com', 'password123', 'Test User');

      expect(usersService.create).toHaveBeenCalledTimes(1);
      const createdArg = usersService.create.mock.calls[0][0];
      expect(createdArg.email).toBe('new@mad3oom.com'); // normalized to lowercase
      expect(createdArg.password).not.toBe('password123'); // must be hashed, never stored plain
      expect(await bcrypt.compare('password123', createdArg.password)).toBe(true);

      expect(result.token).toBe('fake-jwt-token');
      expect(result.user).toEqual({ id: 5, email: 'new@mad3oom.com', name: 'Test User', isAdmin: false });
    });
  });

  describe('login', () => {
    it('rejects login for an email that does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      await expect(service.login('ghost@mad3oom.com', 'whatever')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects login with the wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      usersService.findByEmail.mockResolvedValue({ id: 1, email: 'user@mad3oom.com', password: hash });

      await expect(service.login('user@mad3oom.com', 'wrong-password')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('logs in successfully with the correct password and returns a token', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'user@mad3oom.com',
        password: hash,
        name: 'User',
        isAdmin: true,
      });

      const result = await service.login('user@mad3oom.com', 'correct-password');

      expect(result.token).toBe('fake-jwt-token');
      expect(result.user).toEqual({ id: 1, email: 'user@mad3oom.com', name: 'User', isAdmin: true });
    });
  });
});
