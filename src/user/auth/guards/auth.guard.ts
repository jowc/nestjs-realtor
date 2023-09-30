import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../data-access/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { JwtUserInterface } from 'src/user/types/user.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.authService.getHeaderToken(req);
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
    ]);
    if (roles?.length) {
      const headerUserId = this.jwtService.decode(token) as JwtUserInterface;
      const user = await this.authService.findUserByIdorNull(headerUserId.sub);
      if (!roles.includes(user.user_type)) {
        return false;
      }
    }
    return true;
  }
}
