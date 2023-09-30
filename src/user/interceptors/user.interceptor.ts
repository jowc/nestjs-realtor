import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/data-access/auth.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const token: string = this.authService.getHeaderToken(req);
    try {
      if (token) {
        const user = this.jwtService.verify(token);
        req.appUser = user;
      }
    } catch (error) {
      throw new UnauthorizedException({ message: 'token expired' });
    }
    return next.handle();
  }
}
