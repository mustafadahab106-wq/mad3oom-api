import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListingsService } from '../listings/listings.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly listingsService: ListingsService,
  ) {}

  async findAll() {
    return this.paymentRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findMine(userId: number) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreatePaymentDto, userId: number) {
    const listingResult: any = await this.listingsService.findOne(dto.listingId);
    const listing = listingResult?.data ?? listingResult;

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only request featuring for your own listing');
    }

    const payment = this.paymentRepository.create({
      ...dto,
      userId,
      status: 'pending',
    });

    return this.paymentRepository.save(payment);
  }

  async approve(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    if (payment.status !== 'pending') {
      throw new BadRequestException(`Payment already ${payment.status}`);
    }

    payment.status = 'approved';
    await this.paymentRepository.save(payment);
    await this.listingsService.setFeatured(payment.listingId, true);

    return payment;
  }

  async reject(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    if (payment.status !== 'pending') {
      throw new BadRequestException(`Payment already ${payment.status}`);
    }

    payment.status = 'rejected';
    return this.paymentRepository.save(payment);
  }
      }
