import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthTokensDTO } from '@app/auth/domain/dto/auth-tokens.dto';
import { normalizeHttpRequestCookies } from '@app/shared/http';

export const AuthTokens = createParamDecorator(
  (data: 'access' | 'refresh' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // const headers = normalizeHttpRequestHeaders(request); // For headers implementation
    const cookies = normalizeHttpRequestCookies(request); // For cookies implementation

    // const tokens = AuthTokensFromHeadersDTO.fromHeaders(headers); // For headers implementation
    const tokens = AuthTokensDTO.fromCookies(cookies); // For cookies implementation
    if (data === 'access') {
      return tokens.accessToken;
    }
    if (data === 'refresh') {
      return tokens.refreshToken;
    }
    return tokens;
  }
);
