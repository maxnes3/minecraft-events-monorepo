import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';
import { LoggerService } from '@/shared/logger';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { publicRuntimeConfig } from '@/shared/config';
import type { Response } from 'express';
import { formatedHttpResponse } from '@/shared/http';

@ApiTags('Twitch Auth')
@Controller('twitch/auth')
export class TwitchAuthController {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(TwitchAuthController.name);
  }

  @ApiOperation({ summary: 'Redirect to Twitch authorization URL' })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Redirect to this URL after Twitch authorization',
    required: false
  })
  @Get('redirect')
  public redirectToTwitchAuth(
    @Query('redirect_url') redirectUrl: string | undefined,
    @Res() response: Response
  ) {
    const authRedirectUrl = this.twitchService.getAuthUrl(redirectUrl);
    this.logger.debug(`Redirecting to Twitch auth URL: ${authRedirectUrl}`);
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
    name: 'redirect_url',
    description: 'Redirect to this URL',
    required: false
  })
  @Get('callback')
  public async authCallback(
    @Query('code') code: string,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Query('redirect_url') redirectUrl: string | undefined,
    @Res() response: Response
  ) {
    if (error && errorDescription) {
      this.logger.error(`Twitch OAuth error: ${error} - ${errorDescription}`);
      response.redirect(
        `/error?message=${encodeURIComponent(errorDescription)}`
      );
      return;
    }

    const tokens = await this.twitchService.exchangeCodeToToken(code);
    this.logger.debug('Twitch OAuth successful, obtained user token');

    const userData = await this.twitchService.getUser({
      accessToken: tokens.access_token
    });
    this.logger.debug('Twitch user data get successful');

    if (!redirectUrl) {
      this.logger.warn('Client URL is not configured');
      response.redirect(`/${publicRuntimeConfig.application.apiPrefix}`);
      return;
    }
    this.logger.debug('Redirect to Client URL');
    response.redirect(redirectUrl);
  }

  @ApiOperation({ summary: 'Refresh Twitch user tokens' })
  @Post('refresh')
  @HttpCode(200)
  public async refreshUserTokens(
    @Query(publicRuntimeConfig.twitch.refreshTokenName) refreshToken: string
  ) {
    const tokens = await this.twitchService.refreshUserToken(refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
