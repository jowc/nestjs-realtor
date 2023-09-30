import { Image, PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
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
  city: string;

  @IsNumber()
  @IsOptional()
  land_size?: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  property_type: PropertyType;

  @IsOptional()
  @IsNotEmpty()
  user: unknown;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];
}

export class CreateImageDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  home_id?: number;
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

  images?: CreateImageDto[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  number_of_bedrooms: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  number_of_bathrooms: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  city: string;

  @IsOptional()
  @IsNumber()
  land_size?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsEnum(PropertyType)
  @IsNotEmpty()
  property_type: PropertyType;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  realtor_id: number;
}

export class InquireHomeDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
