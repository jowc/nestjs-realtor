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
    const user = await this.findUserorNull(req.email);
    if (user) throw new ConflictException('This user already exists');

    const hashedPassword = await bcrypt.hash(req.password, 10);

    if (req.productKey) {
      req.user_status = await UserStatus.VERIFIED;
      delete req.productKey;
    }

    return await this.prismaService.user.create({
      data: {
        ...req,
        password: hashedPassword,
        user_type,
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

  async generateProductKey(email: string, userType: UserType) {
    const key = this.getKey(email, userType);
    return await bcrypt.hash(key, 10);
  }

  async findUserorNull(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findUserByIdorNull(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  getHeaderToken(req: any) {
    return req?.headers?.authorization?.split('Bearer ')[1] as string;
  }

  getKey(email: string, userType: UserType) {
    return `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
  }
}
