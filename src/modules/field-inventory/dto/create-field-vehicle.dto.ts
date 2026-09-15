import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DamageSeverity,
  FieldInventoryStatus,
  FieldSourceType,
} from '../entities/field-vehicle.entity';

export class CreateFieldVehicleDto {
  @IsString() make: string;
  @IsString() model: string;
  @Type(() => Number) @IsInt() @Min(1950) @Max(2100) year: number;
  @Type(() => Number) @IsNumber() @Min(0) askingPrice: number;

  @IsOptional() @Type(() => Number) @IsInt() scrapyardId?: number;
  @IsOptional() @IsEnum(FieldSourceType) sourceType?: FieldSourceType;
  @IsOptional() @IsString() trim?: string;
  @IsOptional() @Type(() => Number) @IsInt() mileage?: number;
  @IsOptional() @IsString() vin?: string;
  @IsOptional() @IsString() origin?: string;
  @IsOptional() @IsString() transmission?: string;
  @IsOptional() @IsString() fuelType?: string;
  @IsOptional() @IsArray() damageTypes?: string[];
  @IsOptional() @IsEnum(DamageSeverity) damageSeverity?: DamageSeverity;
  @IsOptional() @IsString() damageNotes?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsBoolean() negotiable?: boolean;
  @IsOptional() @IsEnum(FieldInventoryStatus) inventoryStatus?: FieldInventoryStatus;
  @IsOptional() @IsString() internalNotes?: string;
}
