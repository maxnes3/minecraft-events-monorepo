import { AuthService } from '@/auth/application/auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { AuthRefreshTokensDTO } from '@/auth/application/dto/auth-refresh-tokens.dto';
import type { Response } from 'express';
import { formatedHttpResponse } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiBody({ type: AuthRefreshTokensDTO, required: true })
  @Post('refresh-token')
  public async refreshToken(
    @Body() data: AuthRefreshTokensDTO,
    @Res() response: Response
  ) {
    const tokens = await this.authService.refreshTokens(data.refreshToken);
    response.appendHeader(
      publicRuntimeConfig.jwt.authorizationHeader,
      `Bearer ${tokens.accessToken}`
    );
    response.appendHeader(
      publicRuntimeConfig.jwt.refreshTokenHeader,
      `Bearer ${tokens.refreshToken}`
    );
    return formatedHttpResponse({ success: true });
  }
}
