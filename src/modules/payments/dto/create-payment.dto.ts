import { IsNumber, IsString, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  listingId: number;

  @IsString()
  @IsIn(['featured_7d', 'golden_30d'])
  planId: string;

  @IsString()
  @IsIn(['card', 'bank_transfer', 'cash'])
  paymentMethod: string;
}
