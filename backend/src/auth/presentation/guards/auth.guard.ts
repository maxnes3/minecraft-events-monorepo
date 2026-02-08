import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '@app/auth/application/auth.service';
import { AuthTokensFromHeadersDTO } from '@app/auth/domain/dto/auth-tokens-from-headers.dto';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { normalizeHttpRequestHeaders } from '@app/shared/http';
import { AuthExtendedRequest } from '@app/auth/domain/interfaces/auth-extended-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()) ||
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getClass());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthExtendedRequest>();
    const headers = normalizeHttpRequestHeaders(request as unknown as Request);

    const tokens = AuthTokensFromHeadersDTO.fromHeaders(headers);
    if (!tokens.accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.authService.validateToken(tokens.accessToken);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
