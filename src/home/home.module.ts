import { Module } from '@nestjs/common';
import { HomeController } from './controllers/home.controller';
import { HomeService } from './data-access/home.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [PrismaModule],
})
export class HomeModule {}
