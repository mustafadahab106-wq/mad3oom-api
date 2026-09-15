import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldSourceType } from '../entities/field-vehicle.entity';

export class QuickCaptureDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Type(() => Number) @IsInt() @Min(1950) @Max(2100)
  year: number;

  @Type(() => Number) @IsNumber() @Min(0)
  askingPrice: number;

  @IsOptional() @Type(() => Number) @IsInt()
  scrapyardId?: number;

  @IsOptional() @IsEnum(FieldSourceType)
  sourceType?: FieldSourceType;

  @IsOptional() @IsArray()
  images?: string[];

  @IsOptional() @IsString()
  city?: string;
}
