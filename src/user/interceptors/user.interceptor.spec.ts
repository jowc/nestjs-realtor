import { UserInterceptor } from './user.interceptor';

describe('Interceptor', () => {
  it('should be defined', () => {
    expect(new UserInterceptor()).toBeDefined();
  });
});
