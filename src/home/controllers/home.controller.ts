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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from '../data-access/home.service';
import * as homeDto from '../dtos/home.dto';
import { HomeQueryInterface } from '../data-access/home.types';
import { User } from 'src/user/decorator/user.decorator';
import { Roles } from 'src/user/decorator/roles.decorator';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUserInterface } from 'src/user/types/user.types';
import { AuthGuard } from 'src/user/auth/guards/auth.guard';

@Controller('v1/home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly prismaService: PrismaService,
  ) {}

  @Roles(UserType.BUYER)
  @Get()
  async getHomes(
    @Query() query: HomeQueryInterface,
  ): Promise<homeDto.HomeResponseDto[]> {
    return await this.homeService.getHomes(query);
  }

  @Get(':id')
  async getHome(@Param('id', ParseIntPipe) id: number) {
    return await this.homeService.getHome(id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Post()
  async createHome(
    @Body() body: homeDto.CreateHomeDto,
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
    @Body() body: homeDto.UpdateHomeDto,
    @User() user: JwtUserInterface,
  ) {
    const realtorMatch = await this.homeService.getExactRealtorHome(
      id,
      user.sub,
    );
    if (!realtorMatch) throw new UnauthorizedException();
    return await this.homeService.updateHome(id, body);
  }

  @Patch(':id/image')
  async updateHomeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: homeDto.CreateImageDto[],
    @User() user: JwtUserInterface,
  ) {
    const realtorMatch = await this.homeService.getExactRealtorHome(
      id,
      user.sub,
    );
    if (!realtorMatch) throw new UnauthorizedException();
    return await this.homeService.updateHomeImage(id, body);
  }

  @Delete(':id/image')
  async deleteHomeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body('imageId') imageId: number,
    @User() user: JwtUserInterface,
  ) {
    const realtorMatch = await this.homeService.getExactRealtorHome(
      id,
      user.sub,
    );
    if (!realtorMatch) throw new UnauthorizedException();
    return await this.homeService.deleteHomeImage(id, imageId);
  }

  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtUserInterface,
  ) {
    const realtorMatch = await this.homeService.getExactRealtorHome(
      id,
      user.sub,
    );
    if (!realtorMatch) throw new UnauthorizedException();
    return await this.homeService.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post(':id/inquire')
  async inquire(
    @Param('id') home_id: number,
    @User() user: JwtUserInterface,
    @Body() body: homeDto.InquireHomeDto,
  ) {
    return await this.homeService.inquireHome(home_id, user.sub, body);
  }
}
