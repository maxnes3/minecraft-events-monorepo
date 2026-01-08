import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { TwitchPlatformService } from '../infrastructure/twitch-platform.service';
import { LoggerService } from '@/shared/logger';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { publicRuntimeConfig } from '@/shared/config';
import type { Response } from 'express';

@ApiTags('Twitch Auth')
@Controller('twitch/auth')
export class TwitchAuthController {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(TwitchAuthController.name);
  }

  @ApiOperation({ summary: 'Authenticate the app with Twitch' })
  @Post('app')
  public async getAppToken() {
    this.logger.debug('Requesting app access token');
    const token = await this.twitchService.getAppToken();

    return {
      success: true,
      expires_in: token.expires_in,
      token_type: token.token_type
    };
  }

  @ApiOperation({ summary: 'Redirect to Twitch authorization URL' })
  @Get('redirect')
  public redirectToTwitchAuth(@Res() res: Response) {
    const redirectUrl = this.twitchService.getAuthUrl();
    this.logger.debug(`Redirecting to Twitch auth URL: ${redirectUrl}`);
    res.redirect(redirectUrl);
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
  @Get('callback')
  public async authCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
    @Res() res: Response
  ) {
    if (error) {
      this.logger.error(`Twitch OAuth error: ${error} - ${errorDescription}`);
      res.redirect(`/error?message=${encodeURIComponent(errorDescription)}`);
      return;
    }

    const tokens = await this.twitchService.exchangeCodeToToken(code);
    this.logger.debug('Twitch OAuth successful, obtained user token');

    const userData = await this.twitchService.getUser(tokens.access_token);
    this.logger.debug('Twitch user data get successful');

    if (!publicRuntimeConfig.clients.frontendUrl) {
      this.logger.error('Frontend URL is not configured, redirect failed');
      res.redirect(`/success?message=${JSON.stringify(userData)}`);
      return;
    }
  }

  @ApiOperation({ summary: 'Refresh Twitch user tokens' })
  @Post('refresh')
  public async refreshUserTokens(
    @Body(publicRuntimeConfig.twitch.refreshTokenName) refreshToken: string
  ) {
    const tokens = await this.twitchService.refreshUserToken(refreshToken);
    this.logger.debug('Twitch user tokens refreshed successfully');
    return tokens;
  }
}
