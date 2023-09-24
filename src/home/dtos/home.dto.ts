import { PropertyType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateHomeDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  number_of_bedrooms: number;

  @IsNumber()
  @IsNotEmpty()
  number_of_bathrooms: number;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  land_size?: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  property_type: PropertyType;

  @IsNumber()
  @IsNotEmpty()
  realtor_id: number;
}
