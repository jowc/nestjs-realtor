import { Module } from '@nestjs/common';
import { AuthService } from './auth/data-access/auth.service';
import { AuthController } from './auth/controllers/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule],
})
export class UserModule {}
