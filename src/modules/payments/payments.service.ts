import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListingsService } from '../listings/listings.service';
import { getPackage, PACKAGES } from './packages';
import { createCheckoutSession } from './stripe.helper';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly listingsService: ListingsService,
  ) {}

  getPackages() {
    return PACKAGES;
  }

  async findAll() {
    return this.paymentRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findMine(userId: number) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  private async assertOwnsListing(listingId: number, userId: number) {
    const listingResult: any = await this.listingsService.findOne(listingId);
    const listing = listingResult?.data ?? listingResult;
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only request featuring for your own listing');
    }
    return listing;
  }

  async create(dto: CreatePaymentDto, userId: number) {
    await this.assertOwnsListing(dto.listingId, userId);
    const pkg = getPackage(dto.planId);

    const payment = await this.paymentRepository.save(
      this.paymentRepository.create({
        listingId: dto.listingId,
        userId,
        amount: pkg.priceAED,
        paymentMethod: dto.paymentMethod,
        plan: pkg.id,
        status: 'pending',
      }),
    );

    if (dto.paymentMethod === 'card') {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        throw new InternalServerErrorException('Card payment is not configured yet');
      }
      const baseUrl = process.env.FRONTEND_URL || 'https://mad3oom.com';
      const session = await createCheckoutSession({
        secretKey,
        priceAED: pkg.priceAED,
        productName: pkg.nameEn,
        successUrl: `${baseUrl}/profile/?payment=success`,
        cancelUrl: `${baseUrl}/profile/?payment=cancelled`,
        metadata: { paymentId: String(payment.id) },
      });
      payment.transactionId = session.id;
      await this.paymentRepository.save(payment);
      return { ...payment, checkoutUrl: session.url };
    }

    return payment;
  }

  private async markApproved(payment: Payment) {
    const pkg = getPackage(payment.plan);
    payment.status = 'approved';
    await this.paymentRepository.save(payment);
    const featuredUntil = new Date(Date.now() + pkg.days * 24 * 60 * 60 * 1000);
    await this.listingsService.setFeatured(payment.listingId, featuredUntil);
    return payment;
  }

  // موافقة يدوية (تحويل بنكي / كاش) من الأدمن
  async approve(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    if (payment.status !== 'pending') {
      throw new BadRequestException(`Payment already ${payment.status}`);
    }
    return this.markApproved(payment);
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

  // "اشترِ الآن" — شراء مباشر لسيارة موثّقة (Mad3oom Certified) بسعرها الكامل
  async createBuyNowSession(listingId: number, buyerUserId: number) {
    const listingResult: any = await this.listingsService.findOne(listingId);
    const listing = listingResult?.data ?? listingResult;
    if (!listing) throw new NotFoundException('Listing not found');
    if (!listing.isCertified) {
      throw new BadRequestException('Direct purchase is only available for Mad3oom Certified listings');
    }
    if (listing.status === 'sold') {
      throw new BadRequestException('This listing has already been sold');
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new InternalServerErrorException('Card payment is not configured yet');
    }
    const baseUrl = process.env.FRONTEND_URL || 'https://mad3oom.com';
    const session = await createCheckoutSession({
      secretKey,
      priceAED: Number(listing.price) || 0,
      productName: `${listing.make || ''} ${listing.model || ''} ${listing.year || ''}`.trim() || 'Mad3oom Certified Vehicle',
      successUrl: `${baseUrl}/listing/?id=${listingId}&purchase=success`,
      cancelUrl: `${baseUrl}/listing/?id=${listingId}&purchase=cancelled`,
      metadata: { buyNowListingId: String(listingId), buyerUserId: String(buyerUserId) },
    });

    return { checkoutUrl: session.url };
  }

  async handleBuyNowCompleted(listingId: number) {
    await this.listingsService.markSold(listingId);
  }

  // يُستدعى من ويبهوك Stripe بعد التحقق من التوقيع بالكونترولر
  async handleStripeCheckoutCompleted(paymentId: number) {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment || payment.status !== 'pending') return;
    await this.markApproved(payment);
  }
}
