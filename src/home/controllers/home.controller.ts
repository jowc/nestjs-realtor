import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HomeService } from '../data-access/home.service';

@Controller('v1/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes() {
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHome(id);
  }

  @Post()
  createHome(@Body() body: any) {
    return this.homeService.createHome(body);
  }

  @Patch(':id')
  updateHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.updateHome(id);
  }

  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }
}
