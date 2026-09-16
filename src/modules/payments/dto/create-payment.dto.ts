import { IsNumber, IsPositive, IsString, IsOptional, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  listingId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['bank_transfer', 'cash', 'card'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
