import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto } from '../dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  getHome(id: number) {
    return 'home';
  }

  async getHomes() {
    return await this.prismaService.home.findMany();
  }

  async createHome(body: CreateHomeDto) {
    // return await this.prismaService.home.create({ data: { ...body } });
    return body;
  }

  updateHome(body: any) {
    return 'updated home';
  }

  deleteHome(id: number) {
    return 'deleted home';
  }
}
