import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from '../dtos/home.dto';
import { HomeQueryInterface } from './home.types';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHome(id: number) {
    try {
      return await this.prismaService.home.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Home not found');
    }
  }

  async getHomes(query?: HomeQueryInterface): Promise<HomeResponseDto[]> {
    const price =
      query.minPrice || query.maxPrice
        ? {
            ...(query.minPrice && { gte: +query.minPrice }),
            ...(query.maxPrice && { lte: +query.maxPrice }),
          }
        : undefined;
    const filter = {
      ...(query.city && { city: query.city }),
      ...(price && { price }),
      ...(query.propertyType && { property_type: query.propertyType }),
    };
    return (
      await this.prismaService.home.findMany({
        include: { images: { select: { url: true } } },
        where: filter,
      })
    ).map((home) => new HomeResponseDto(home));
  }

  async createHome(body: CreateHomeDto) {
    let payload: any;
    // Check if posts should be included in the query
    if (body?.images?.length) {
      payload = {
        ...body,
        images: {
          create: body.images,
        },
      };
    } else {
      payload = {
        ...body,
      };
    }
    return await this.prismaService.home.create({
      data: { ...payload },
      include: { images: true },
    });
  }

  async updateHome(id: number, body: any) {
    try {
      return await this.prismaService.home.update({
        where: { id },
        data: { ...body },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteHome(id: number) {
    try {
      return await this.prismaService.home.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
