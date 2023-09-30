import { Module } from '@nestjs/common';
import { AuthService } from './auth/data-access/auth.service';
import { AuthController } from './auth/controllers/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_CONSTANT,
      signOptions: { expiresIn: '2hr' },
    }),
  ],
  exports: [AuthService],
})
export class UserModule {}
