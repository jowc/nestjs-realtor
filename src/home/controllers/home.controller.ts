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
import { CreateHomeDto, HomeResponseDto } from '../dtos/home.dto';
import { HomeQueryInterface } from '../data-access/home.types';

@Controller('v1/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomes(
    @Query() query: HomeQueryInterface,
  ): Promise<HomeResponseDto[]> {
    return await this.homeService.getHomes(query);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHome(id);
  }

  @Post()
  async createHome(@Body() body: CreateHomeDto) {
    return await this.homeService.createHome(body);
  }

  @Patch(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateHomeDto,
  ) {
    return this.homeService.updateHome(id, body);
  }

  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }
}
