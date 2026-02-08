import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { publicRuntimeConfig } from '@app/shared/config';
import { formatedHttpResponse } from '@app/shared/http';
import { Public } from '@app/auth';
import type { Response } from 'express';

@ApiTags('Twitch Auth')
@Controller('twitch/auth')
@Public()
export class TwitchAuthController {
  constructor(private readonly twitchService: TwitchPlatformService) {}

  @ApiOperation({ summary: 'Redirect to Twitch authorization URL' })
  @ApiQuery({
    name: 'is_client',
    description: 'Redirect to Client URL after Twitch authorization',
    type: Boolean,
    required: false
  })
  @Get('redirect')
  public redirectToTwitchAuth(
    @Query('is_client') isClient: boolean | undefined,
    @Res() response: Response
  ) {
    const authRedirectUrl = this.twitchService.getAuthUrl(isClient);
    response.redirect(authRedirectUrl);
  }

  @ApiOperation({ summary: 'Twitch authorization callback' })
  @ApiQuery({ name: 'code', required: true, description: 'Authorization code' })
  @ApiQuery({
    name: 'state',
    required: false,
    description: 'CSRF protection state'
  })
  @ApiQuery({
    name: 'error',
    required: false,
    description: 'Error code if failed'
  })
  @ApiQuery({
    name: 'error_description',
    required: false,
    description: 'Error description if failed'
  })
  @ApiQuery({
    name: 'is_client',
    description: 'Redirect to Client URL',
    required: false
  })
  @Get('callback')
  public async authCallback(
    @Query('code') code: string,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Query('is_client') isClient: boolean | undefined,
    @Res() response: Response
  ) {
    if (error && errorDescription) {
      if (!isClient) {
        response.redirect(
          `/error?message=${encodeURIComponent(errorDescription)}`
        );
        return;
      }
      return formatedHttpResponse({ success: false, error });
    }

    const tokens = await this.twitchService.exchangeCodeToToken(code);

    const userData = await this.twitchService.getUser({
      accessToken: tokens.accessToken
    });
    if (!userData) {
      return formatedHttpResponse({ success: false });
    }

    const authData = await this.twitchService.authUserByPlatform(
      tokens,
      userData
    );
    if (!isClient) {
      response.redirect(`/${publicRuntimeConfig.application.apiPrefix}`);
      return;
    }
    return formatedHttpResponse({ success: true, data: authData });
  }

  @ApiOperation({ summary: 'Refresh Twitch user tokens' })
  @Post('refresh')
  @HttpCode(200)
  public async refreshUserTokens(@Query('refresh_token') refreshToken: string) {
    const tokens = await this.twitchService.refreshUserToken(refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
