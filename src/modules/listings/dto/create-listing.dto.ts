import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  Max,
  IsPositive,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  mileage?: number;

  @IsOptional()
  @IsString()
  damageType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  legalStatus?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  engineSize?: string;

  @IsOptional()
  @IsNumber()
  doors?: number;

  @IsOptional()
  @IsNumber()
  seats?: number;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsString()
  insurance?: string;

  @IsOptional()
  @IsBoolean()
  serviceHistory?: boolean;

  @IsOptional()
  @IsBoolean()
  testDrive?: boolean;

  @IsOptional()
  @IsBoolean()
  warranty?: boolean;

  @IsOptional()
  @IsString()
  sellerName?: string;
}