import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  getHome(id: number) {
    return 'home';
  }

  async getHomes() {
    return await this.prismaService.home.findMany();
  }

  createHome(body: any) {
    return 'created home';
  }

  updateHome(body: any) {
    return 'updated home';
  }

  deleteHome(id: number) {
    return 'deleted home';
  }
}
