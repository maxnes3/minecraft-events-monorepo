import { Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { formatedHttpResponse } from '@app/shared/http';
import { AuthService } from '@app/auth/application/auth.service';
import { Public } from '../decorators/public.decorator';
import { AuthTokens } from '../decorators/auth-tokens.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @Post('refresh-tokens')
  @HttpCode(200)
  public async refreshTokens(
    @AuthTokens('refresh') refreshToken: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const tokens = await this.authService.refreshTokens(refreshToken);
    this.authService.insertTokensInResponse(response, tokens);
    return formatedHttpResponse({ success: true });
  }

  @ApiOperation({ summary: 'Logout and remove authentication tokens' })
  @Post('logout')
  @HttpCode(200)
  public logout(@Res({ passthrough: true }) response: Response) {
    this.authService.removeTokensFromResponse(response);
    return formatedHttpResponse({ success: true });
  }
}
