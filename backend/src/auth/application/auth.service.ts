import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '@app/shared/logger';
import { Response } from 'express';
import { publicRuntimeConfig } from '@app/shared/config';
import { AuthTokensDTO } from './dto/auth-tokens.dto';
import { AuthTokenPayloadDTO } from '../domain/dto/auth-token-payload.dto';

@Injectable()
export class AuthService {
  private readonly secret: string;
  private readonly expiresIn: number;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: number;
  private readonly accessTokenCookieName: string;
  private readonly refreshTokenCookieName: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {
    this.secret = publicRuntimeConfig.jwt.secret;
    this.expiresIn = publicRuntimeConfig.jwt.expiresIn;
    this.refreshSecret = publicRuntimeConfig.jwt.refreshSecret;
    this.refreshExpiresIn = publicRuntimeConfig.jwt.refreshExpiresIn;
    this.accessTokenCookieName = publicRuntimeConfig.jwt.accessTokenCookieName;
    this.refreshTokenCookieName =
      publicRuntimeConfig.jwt.refreshTokenCookieName;

    this.logger.setContext(AuthService.name);
  }

  public async createToken(userId: string): Promise<AuthTokensDTO> {
    const payload: AuthTokenPayloadDTO = {
      sub: userId
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: this.expiresIn
    });
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn
      }
    );

    this.logger.debug(`Token created for user: ${userId}`);
    return {
      accessToken,
      refreshToken,
      expiresIn: this.expiresIn,
      refreshExpiresIn: this.refreshExpiresIn,
      obtainedAt: new Date().toISOString()
    };
  }

  public async validateToken(token: string): Promise<AuthTokenPayloadDTO> {
    try {
      const payload = await this.jwtService.verifyAsync<AuthTokenPayloadDTO>(
        token,
        {
          secret: this.secret
        }
      );

      this.logger.debug(`Token validated for user: ${payload.sub}`);
      return payload;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  public async refreshTokens(refreshToken: string): Promise<AuthTokensDTO> {
    try {
      const payload = await this.jwtService.verifyAsync<AuthTokenPayloadDTO>(
        refreshToken,
        {
          secret: this.refreshSecret
        }
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.createToken(payload.sub);
    } catch (error) {
      this.logger.error(`Refresh token failed: ${error}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public decodeToken(token: string): AuthTokenPayloadDTO | null {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      this.logger.warn(`Token decode failed: ${error}`);
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  public insertTokensInResponse(response: Response, tokens: AuthTokensDTO) {
    this.addCookieToResponse(
      response,
      this.accessTokenCookieName,
      tokens.accessToken,
      tokens.expiresIn * 1000
    );
    this.addCookieToResponse(
      response,
      this.refreshTokenCookieName,
      tokens.refreshToken,
      tokens.refreshExpiresIn * 1000
    );
  }

  public removeTokensFromResponse(response: Response) {
    this.removeCookie(response, this.accessTokenCookieName);
    this.removeCookie(response, this.refreshTokenCookieName);
  }

  private addCookieToResponse(
    response: Response,
    cookie: string,
    value: string,
    expiresIn: number
  ) {
    response.cookie(cookie, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: expiresIn
    });
  }

  private removeCookie(response: Response, cookie: string) {
    response.clearCookie(cookie, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });
  }
}
