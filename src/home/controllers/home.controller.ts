import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HomeService } from '../data-access/home.service';
import {
  CreateHomeDto,
  CreateImageDto,
  HomeResponseDto,
  UpdateHomeDto,
} from '../dtos/home.dto';
import { HomeQueryInterface } from '../data-access/home.types';
import { User } from 'src/user/decorator/user.decorator';
import { Roles } from 'src/user/decorator/roles.decorator';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUserInterface } from 'src/user/types/user.types';

@Controller('v1/home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getHomes(
    @Query() query: HomeQueryInterface,
  ): Promise<HomeResponseDto[]> {
    return await this.homeService.getHomes(query);
  }

  @Get(':id')
  async getHome(@Param('id', ParseIntPipe) id: number) {
    return await this.homeService.getHome(id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Post()
  async createHome(
    @Body() body: CreateHomeDto,
    @User() user: JwtUserInterface,
  ) {
    const realtor = await this.prismaService.user.findUnique({
      where: { id: user.sub },
    });
    const updatedBody = { ...body, realtor_id: realtor.id };
    return await this.homeService.createHome(updatedBody);
  }

  @Patch(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
  ) {
    return await this.homeService.updateHome(id, body);
  }

  @Patch(':id/image')
  async updateHomeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateImageDto[],
  ) {
    return await this.homeService.updateHomeImage(id, body);
  }

  @Delete(':id/image')
  async deleteHomeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body('imageId') imageId: number,
  ) {
    return await this.homeService.deleteHomeImage(id, imageId);
  }
  @Delete(':id')
  async deleteHome(@Param('id', ParseIntPipe) id: number) {
    return await this.homeService.deleteHome(id);
  }
}
