import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { UserStatus, UserType } from '@prisma/client';
import { CreateUserDto, SignInDto } from '../dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userType: UserType, req: CreateUserDto) {
    const user_type = userType;
    const user = this.findUserorNull(req.email);
    if (user) throw new ConflictException();

    const hashedPassword = await bcrypt.hash(req.password, 10);

    return await this.prismaService.user.create({
      data: {
        ...req,
        password: hashedPassword,
        user_type,
        user_status: UserStatus.UNVERIFIED,
      },
    });
  }

  async signIn(body: SignInDto) {
    const user = await this.findUserorNull(body?.email);
    if (!user) throw new NotFoundException('username or password is incorrect');
    const comparePassword = await bcrypt.compare(body?.password, user.password);
    if (!comparePassword)
      throw new NotFoundException('username or password is incorrect');

    return { token: await this.jwtService.signAsync({ sub: user.id }) };
  }

  async findUserorNull(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
}