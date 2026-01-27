import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthExtendedRequest } from '@/auth/domain/interfaces/auth-extended-request.interface';
import { AuthTokenPayloadDTO } from '@/auth/domain/dto/auth-token-payload.dto';

export const User = createParamDecorator(
  <K extends keyof AuthTokenPayloadDTO>(
    data: K | undefined,
    ctx: ExecutionContext
  ): AuthTokenPayloadDTO | AuthTokenPayloadDTO[K] => {
    const request = ctx.switchToHttp().getRequest<AuthExtendedRequest>();
    const user = request.user;
    if (!user) {
      throw new Error(
        'User not found in request. Make sure AuthGuard is used.'
      );
    }

    if (data) {
      if (!(data in user)) {
        throw new Error(`Property "${String(data)}" not found in user object`);
      }
      return user[data];
    }
    return user;
  }
);
