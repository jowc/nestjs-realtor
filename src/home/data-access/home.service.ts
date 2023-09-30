import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateHomeDto,
  CreateImageDto,
  HomeResponseDto,
  InquireHomeDto,
  UpdateHomeDto,
} from '../dtos/home.dto';
import { HomeQueryInterface } from './home.types';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHome(id: number) {
    try {
      const home = await this.prismaService.home.findUniqueOrThrow({
        where: { id },
        include: {
          images: {
            select: {
              url: true,
            },
          },
        },
      });
      return new HomeResponseDto(home);
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
        where: filter,
        include: { images: { select: { url: true } } },
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
    const home = await this.prismaService.home.create({
      data: { ...payload },
      include: { images: { select: { url: true } } },
    });

    return new HomeResponseDto(home);
  }

  async updateHome(id: number, body: UpdateHomeDto) {
    try {
      const updatedHome = await this.prismaService.home.update({
        where: { id },
        data: { ...body },
      });

      return new HomeResponseDto(updatedHome);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }
  }

  async updateHomeImage(id: number, body: CreateImageDto[]) {
    try {
      const updatedHome = await this.prismaService.home.update({
        where: { id },
        data: {
          images: {
            create: body,
          },
        },
        include: {
          images: {
            select: {
              url: true,
            },
          },
        },
      });
      return new HomeResponseDto(updatedHome);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }
  }

  async deleteHomeImage(id: number, imageId: number) {
    try {
      const image = await this.prismaService.image.delete({
        where: { id: imageId, home_id: id },
      });

      return { message: `Home with id: ${image.id} has been deleted` };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async deleteHome(id: number) {
    try {
      const home = await this.prismaService.home.delete({ where: { id } });
      return { message: `Home with id: ${home.id} has been deleted` };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getExactRealtorHome(id: number, realtor_id: number) {
    return this.prismaService.home.findUnique({
      where: {
        id,
        realtor_id,
      },
    });
  }

  async inquireHome(home_id: number, buyer_id: number, body: InquireHomeDto) {
    const home = await this.getHome(home_id);
    const updatedBody = {
      ...body,
      buyer_id,
      realtor_id: home.realtor_id,
      home_id: home.id,
    };
    const message = await this.prismaService.message.create({
      data: updatedBody,
    });
    return message;
  }
}
