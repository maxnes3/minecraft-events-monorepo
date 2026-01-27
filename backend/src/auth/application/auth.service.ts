import { LoggerService } from '@/shared/logger';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokensDTO } from './dto/auth-tokens.dto';
import { publicRuntimeConfig } from '@/shared/config';
import { AuthTokenPayloadDTO } from '../domain/dto/auth-token-payload.dto';

@Injectable()
export class AuthService {
  private readonly secret: string;
  private readonly expiresIn: number;
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {
    this.secret = publicRuntimeConfig.jwt.secret;
    this.expiresIn = publicRuntimeConfig.jwt.expiresIn;
    this.refreshSecret = publicRuntimeConfig.jwt.refreshSecret;

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
        expiresIn: '7d'
      }
    );

    this.logger.debug(`Token created for user: ${userId}`);
    return {
      accessToken,
      refreshToken,
      expiresIn: this.expiresIn,
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
}
