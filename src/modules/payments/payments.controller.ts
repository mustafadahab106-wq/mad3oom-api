import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  Headers,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { verifyStripeSignature } from './stripe.helper';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // الباقات المتاحة — عام، بدون تسجيل دخول
  @Get('packages')
  packages() {
    return this.paymentsService.getPackages();
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: any) {
    return this.paymentsService.findMine(Number(req.user.userId));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.create(dto, Number(req.user.userId));
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  approve(@Param('id') id: string) {
    return this.paymentsService.approve(+id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  reject(@Param('id') id: string) {
    return this.paymentsService.reject(+id);
  }

  // Stripe يستدعي هذا مباشرة — بدون JWT، محمي بتوقيع Stripe نفسه
  @Post('webhook')
  @HttpCode(200)
  async webhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new BadRequestException('Webhook not configured');

    const rawBody: Buffer = req.rawBody;
    if (!rawBody || !verifyStripeSignature(rawBody, signature, secret)) {
      throw new BadRequestException('Invalid signature');
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    if (event.type === 'checkout.session.completed') {
      const paymentId = Number(event.data?.object?.metadata?.paymentId);
      if (paymentId) await this.paymentsService.handleStripeCheckoutCompleted(paymentId);
    }
    return { received: true };
  }
}
