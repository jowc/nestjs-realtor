import { Body, Controller, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { AuthService } from '../data-access/auth.service';
import { UserType } from '@prisma/client';
import { CreateUserDto } from '../dtos/auth.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/:userType')
  signUp(
    @Param('userType', new ParseEnumPipe(UserType))
    userType: UserType,
    @Body() res: CreateUserDto,
  ) {
    return this.authService.signUp(userType, res);
  }
}
