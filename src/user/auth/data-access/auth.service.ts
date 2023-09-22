import { ConflictException, Injectable } from '@nestjs/common';
import { UserStatus, UserType } from '@prisma/client';
import { CreateUserDto } from '../dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInterface } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(userType: UserType, res: CreateUserDto) {
    const user_type = userType;
    const user = await this.prismaService.user.findUnique({
      where: { email: res.email },
    });
    if (user) throw new ConflictException();

    return await this.prismaService.user.create({
      data: { ...res, user_type, user_status: UserStatus.UNVERIFIED },
    });
  }
}
