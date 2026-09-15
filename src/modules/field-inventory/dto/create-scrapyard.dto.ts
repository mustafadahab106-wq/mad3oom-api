import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScrapyardDto {
  @IsString()
  name: string;

  @IsOptional() @IsString()
  city?: string;

  @IsOptional() @IsString()
  locationText?: string;

  @IsOptional() @IsNumber()
  latitude?: number;

  @IsOptional() @IsNumber()
  longitude?: number;

  @IsOptional() @IsString()
  contactName?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString()
  whatsapp?: string;
}
