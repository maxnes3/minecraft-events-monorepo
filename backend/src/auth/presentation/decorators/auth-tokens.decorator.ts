import { AuthTokensFromHeadersDTO } from '@/auth/domain/dto/auth-tokens-from-headers.dto';
import { normalizeHttpRequestHeaders } from '@/shared/http';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthTokens = createParamDecorator(
  (data: 'access' | 'refresh' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const headers = normalizeHttpRequestHeaders(request);

    const tokens = AuthTokensFromHeadersDTO.fromHeaders(headers);
    if (data === 'access') {
      return tokens.accessToken;
    }
    if (data === 'refresh') {
      return tokens.refreshToken;
    }
    return tokens;
  }
);
