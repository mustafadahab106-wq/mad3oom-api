// src/modules/listings/dto/create-listing.dto.ts
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class CreateListingDto {
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsNumberString()
  price?: any;

  @IsOptional() @IsString()
  make?: string;

  @IsOptional() @IsString()
  model?: string;

  @IsOptional() @IsNumberString()
  year?: any;

  @IsOptional() @IsNumberString()
  mileage?: any;

  @IsOptional() @IsString()
  city?: string;

  @IsOptional() @IsString()
  damageType?: string;

  @IsOptional() @IsString()
  legalStatus?: string;

  @IsOptional() @IsString()
  vin?: string;

  @IsOptional() @IsString()
  whatsapp?: string;

  // ✅ مهم: نخليها تقبل string[] أو string
  @IsOptional()
  images?: string[] | string;
}
