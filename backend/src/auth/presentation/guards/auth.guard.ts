import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { normalizeHttpRequestCookies } from '@app/shared/http';
import { AuthService } from '@app/auth/application/auth.service';
import { AuthExtendedRequest } from '@app/auth/domain/interfaces/auth-extended-request.interface';
import { AuthTokensDTO } from '@app/auth/domain/dto/auth-tokens.dto';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

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
    // const headers = normalizeHttpRequestHeaders(request as unknown as Request); // For headers implementation
    const cookies = normalizeHttpRequestCookies(request as unknown as Request); // For cookies implementation

    // const tokens = AuthTokensFromHeadersDTO.fromHeaders(headers); // For headers implementation
    const tokens = AuthTokensDTO.fromCookies(cookies); // For cookies implementation
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
