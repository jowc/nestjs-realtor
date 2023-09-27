import { PropertyType } from '@prisma/client';

export interface HomeQueryInterface {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType: PropertyType;
}

export interface CreateHomeInterface {
  address: string;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  city: string;
  land_size?: number;
  price: number;
  property_type: PropertyType;
  realtor_id: number;
}
