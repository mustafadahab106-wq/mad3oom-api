import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingsService } from '../listings/listings.service';
import { CreateFieldVehicleDto } from './dto/create-field-vehicle.dto';
import { CreateScrapyardDto } from './dto/create-scrapyard.dto';
import { QuickCaptureDto } from './dto/quick-capture.dto';
import { UpdateFieldVehicleDto } from './dto/update-field-vehicle.dto';
import {
  FieldInventoryStatus,
  FieldSourceType,
  FieldVehicle,
  FieldVerificationStatus,
} from './entities/field-vehicle.entity';
import { Scrapyard } from './entities/scrapyard.entity';

@Injectable()
export class FieldInventoryService {
  constructor(
    @InjectRepository(FieldVehicle)
    private readonly vehicleRepo: Repository<FieldVehicle>,
    @InjectRepository(Scrapyard)
    private readonly scrapyardRepo: Repository<Scrapyard>,
    private readonly listingsService: ListingsService,
  ) {}

  private async nextCode(prefix: 'MDM' | 'SCR', city = 'DXB'): Promise<string> {
    const yy = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${city.toUpperCase().slice(0, 3)}-${yy}-${random}`;
  }

  async createScrapyard(dto: CreateScrapyardDto, userId: number) {
    const cityCode = dto.city || 'DXB';
    const scrapyard = this.scrapyardRepo.create({
      ...dto,
      code: await this.nextCode('SCR', cityCode),
      createdByUserId: userId,
    });
    return this.scrapyardRepo.save(scrapyard);
  }

  async listScrapyards() {
    return this.scrapyardRepo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async quickCapture(dto: QuickCaptureDto, userId: number) {
    const vehicle = this.vehicleRepo.create({
      ...dto,
      code: await this.nextCode('MDM', dto.city || 'DXB'),
      sourceType: dto.sourceType || FieldSourceType.FIELD_TEAM,
      images: (dto.images || []).slice(0, 6),
      damageTypes: [],
      inventoryStatus: FieldInventoryStatus.DRAFT,
      verificationStatus: FieldVerificationStatus.UNVERIFIED,
      currency: 'AED',
      negotiable: false,
      capturedByUserId: userId,
    });
    return this.vehicleRepo.save(vehicle);
  }

  async createVehicle(dto: CreateFieldVehicleDto, userId: number) {
    if (dto.images && dto.images.length > 6) {
      throw new BadRequestException('Maximum 6 images per field vehicle');
    }

    const vehicle = this.vehicleRepo.create({
      ...dto,
      code: await this.nextCode('MDM'),
      sourceType: dto.sourceType || FieldSourceType.FIELD_TEAM,
      images: dto.images || [],
      damageTypes: dto.damageTypes || [],
      inventoryStatus: dto.inventoryStatus || FieldInventoryStatus.DRAFT,
      verificationStatus: FieldVerificationStatus.UNVERIFIED,
      currency: dto.currency || 'AED',
      negotiable: dto.negotiable ?? false,
      capturedByUserId: userId,
    });
    return this.vehicleRepo.save(vehicle);
  }

  async findAll(query: any) {
    const qb = this.vehicleRepo
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.scrapyard', 'scrapyard')
      .orderBy('vehicle.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('vehicle.inventoryStatus = :status', { status: query.status });
    }
    if (query.verification) {
      qb.andWhere('vehicle.verificationStatus = :verification', {
        verification: query.verification,
      });
    }
    if (query.scrapyardId) {
      qb.andWhere('vehicle.scrapyardId = :scrapyardId', {
        scrapyardId: Number(query.scrapyardId),
      });
    }
    if (query.q) {
      qb.andWhere(
        '(LOWER(vehicle.make) LIKE LOWER(:q) OR LOWER(vehicle.model) LIKE LOWER(:q) OR LOWER(vehicle.code) LIKE LOWER(:q))',
        { q: `%${query.q}%` },
      );
    }

    const rows = await qb.take(250).getMany();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return rows.map((vehicle) => {
      const stale =
        vehicle.inventoryStatus === FieldInventoryStatus.AVAILABLE &&
        (!vehicle.lastConfirmedAt || now - new Date(vehicle.lastConfirmedAt).getTime() > sevenDays);
      return {
        ...vehicle,
        effectiveVerificationStatus: stale
          ? FieldVerificationStatus.NEEDS_RECHECK
          : vehicle.verificationStatus,
      };
    });
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: { scrapyard: true },
    });
    if (!vehicle) throw new NotFoundException(`Field vehicle #${id} not found`);
    return vehicle;
  }

  async update(id: number, dto: UpdateFieldVehicleDto) {
    const vehicle = await this.findOne(id);
    if (dto.images && dto.images.length > 6) {
      throw new BadRequestException('Maximum 6 images per field vehicle');
    }
    Object.assign(vehicle, dto);
    return this.vehicleRepo.save(vehicle);
  }

  async confirmAvailability(id: number) {
    const vehicle = await this.findOne(id);
    if (vehicle.inventoryStatus === FieldInventoryStatus.SOLD) {
      throw new BadRequestException('Sold vehicle cannot be confirmed as available');
    }
    vehicle.inventoryStatus = FieldInventoryStatus.AVAILABLE;
    vehicle.verificationStatus = FieldVerificationStatus.VERIFIED;
    vehicle.lastConfirmedAt = new Date();
    return this.vehicleRepo.save(vehicle);
  }

  async markStatus(id: number, status: FieldInventoryStatus) {
    const vehicle = await this.findOne(id);
    vehicle.inventoryStatus = status;
    if (status === FieldInventoryStatus.AVAILABLE) {
      vehicle.verificationStatus = FieldVerificationStatus.VERIFIED;
      vehicle.lastConfirmedAt = new Date();
    }
    return this.vehicleRepo.save(vehicle);
  }

  async publish(id: number, userId: number) {
    const vehicle = await this.findOne(id);
    if (vehicle.publishedListingId) {
      return {
        alreadyPublished: true,
        listingId: vehicle.publishedListingId,
      };
    }

    const scrapyardName = vehicle.scrapyard?.name || '';
    const damage = vehicle.damageTypes?.length
      ? vehicle.damageTypes.join(', ')
      : 'Damage details available on request';

    const descriptionParts = [
      `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
      `Damage: ${damage}`,
      scrapyardName ? `Source: ${scrapyardName}` : '',
      'Field-listed by MAD3OOMA. Price and availability should be reconfirmed before purchase.',
    ].filter(Boolean);

    const listingResult = await this.listingsService.createWithImages(
      {
        title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        description: descriptionParts.join('\n'),
        price: String(vehicle.askingPrice),
        make: vehicle.make,
        model: vehicle.model,
        year: String(vehicle.year),
        mileage: vehicle.mileage != null ? String(vehicle.mileage) : undefined,
        city: vehicle.scrapyard?.city || undefined,
        damageType: vehicle.damageTypes?.join(', ') || undefined,
        vin: vehicle.vin || undefined,
        whatsapp: vehicle.scrapyard?.whatsapp || vehicle.scrapyard?.phone || undefined,
        images: vehicle.images || [],
      } as any,
      userId,
    );

    const listingId = Number((listingResult as any)?.data?.id);
    if (!listingId) throw new BadRequestException('Listing publication failed');

    vehicle.publishedListingId = listingId;
    vehicle.inventoryStatus = FieldInventoryStatus.AVAILABLE;
    vehicle.verificationStatus = FieldVerificationStatus.VERIFIED;
    vehicle.lastConfirmedAt = new Date();
    await this.vehicleRepo.save(vehicle);

    return { listingId, vehicle };
  }

  async dashboard() {
    const [activeCars, sold, unverified, scrapyards] = await Promise.all([
      this.vehicleRepo.count({ where: { inventoryStatus: FieldInventoryStatus.AVAILABLE } }),
      this.vehicleRepo.count({ where: { inventoryStatus: FieldInventoryStatus.SOLD } }),
      this.vehicleRepo.count({ where: { verificationStatus: FieldVerificationStatus.UNVERIFIED } }),
      this.scrapyardRepo.count({ where: { isActive: true } }),
    ]);
    return { activeCars, sold, unverified, scrapyards };
  }
  }
