import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from '../data-access/auth.service';
import { UserType } from '@prisma/client';
import { CreateUserDto, SignInDto } from '../dtos/auth.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/:userType')
  signUp(
    @Param('userType', new ParseEnumPipe(UserType))
    userType: UserType,
    @Body() req: CreateUserDto,
  ) {
    return this.authService.signUp(userType, req);
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() req: SignInDto) {
    return this.authService.signIn(req);
  }
}
