import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../data-access/auth.service';
import { UserType } from '@prisma/client';
import {
  CreateUserDto,
  GenerateProductKeyDto,
  SignInDto,
} from '../dtos/auth.dto';

import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/decorator/user.decorator';
import { JwtUserInterface } from 'src/user/types/user.types';
import { AuthGuard } from '../guards/auth.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/:userType')
  async signUp(
    @Param('userType', new ParseEnumPipe(UserType))
    userType: UserType,
    @Body() req: CreateUserDto,
  ) {
    if (userType !== UserType.BUYER) {
      if (!req.productKey) throw new UnauthorizedException();
      const validateProductKey = await bcrypt.compare(
        this.authService.getKey(req.email, userType),
        req.productKey,
      );
      if (!validateProductKey) throw new UnauthorizedException();
    }
    return this.authService.signUp(userType, req);
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() req: SignInDto) {
    return this.authService.signIn(req);
  }

  @Post('product-key')
  @HttpCode(HttpStatus.OK)
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('me')
  async userDetails(@User() user: JwtUserInterface) {
    const foundUser = await this.authService.findUserByIdorNull(user?.sub);
    if (!foundUser) throw new UnauthorizedException();
    return foundUser;
  }
}
