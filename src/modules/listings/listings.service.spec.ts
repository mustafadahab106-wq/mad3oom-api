import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing } from './entities/listing.entity';

describe('ListingsService', () => {
  let service: ListingsService;
  let repo: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingsService, { provide: getRepositoryToken(Listing), useValue: repo }],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  describe('isFeatured expiry (this is what makes the gold badge disappear on its own)', () => {
    it('a listing with a featuredUntil date in the future is reported as featured', async () => {
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000); // +1 day
      repo.findOne.mockResolvedValue({ id: 1, images: '[]', featuredUntil: future });

      const result = await service.findOne(1);

      expect(result.data.isFeatured).toBe(true);
    });

    it('a listing with a featuredUntil date in the past is reported as NOT featured', async () => {
      const past = new Date(Date.now() - 24 * 60 * 60 * 1000); // -1 day
      repo.findOne.mockResolvedValue({ id: 1, images: '[]', featuredUntil: past });

      const result = await service.findOne(1);

      expect(result.data.isFeatured).toBe(false);
    });

    it('a listing with no featuredUntil at all is reported as NOT featured', async () => {
      repo.findOne.mockResolvedValue({ id: 1, images: '[]', featuredUntil: null });

      const result = await service.findOne(1);

      expect(result.data.isFeatured).toBe(false);
    });

    it('setFeatured stores the expiry date and immediately reflects it as featured', async () => {
      const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      repo.findOne.mockResolvedValue({ id: 1, images: '[]' });

      const result = await service.setFeatured(1, future);

      expect(result.isFeatured).toBe(true);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException for a listing that does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update / remove ownership checks', () => {
    it('refuses to update a listing that belongs to a different user', async () => {
      repo.findOne.mockResolvedValue({ id: 1, userId: 42, images: '[]' });
      await expect(service.update(1, { price: 100 } as any, 999)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('refuses to delete a listing that belongs to a different user', async () => {
      repo.findOne.mockResolvedValue({ id: 1, userId: 42 });
      await expect(service.remove(1, 999)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('allows the owner to update their own listing', async () => {
      repo.findOne.mockResolvedValue({ id: 1, userId: 42, images: '[]', price: 100 });
      const result = await service.update(1, { price: 200 } as any, 42);
      expect(result.data).toBeDefined();
    });
  });
});
