import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('me')
  findMine(@Req() req: any) {
    return this.paymentsService.findMine(Number(req.user.userId));
  }

  @Post()
  create(@Body() dto: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.create(dto, Number(req.user.userId));
  }

  @Patch(':id/approve')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: string) {
    return this.paymentsService.approve(+id);
  }

  @Patch(':id/reject')
  @UseGuards(AdminGuard)
  reject(@Param('id') id: string) {
    return this.paymentsService.reject(+id);
  }
}
