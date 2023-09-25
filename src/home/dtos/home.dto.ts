import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
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

export class HomeResponseDto {
  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }

  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  city: string;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  price: number;

  @Exclude()
  property_type: PropertyType;

  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }

  @Exclude()
  realtor_id: number;
  @Expose({ name: 'realtorId' })
  realtorId() {
    return this.realtorId;
  }

  @Exclude()
  listed_date: Date;

  @Exclude()
  updated_at: Date;
}
