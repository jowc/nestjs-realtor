import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeController } from './controllers/home.controller';
import { HomeService } from './data-access/home.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [PrismaModule, UserModule],
})
export class HomeModule {}
