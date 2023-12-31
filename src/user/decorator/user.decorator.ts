import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req?.appUser;
});
