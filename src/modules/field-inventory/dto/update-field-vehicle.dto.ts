import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldVehicleDto } from './create-field-vehicle.dto';

export class UpdateFieldVehicleDto extends PartialType(CreateFieldVehicleDto) {}
