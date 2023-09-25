import { PropertyType } from '@prisma/client';

export interface HomeQueryInterface {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType: PropertyType;
}
