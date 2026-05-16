import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { AuthService, Public } from '@app/auth';
import { formatedHttpResponse } from '@app/shared/http';
import { publicRuntimeConfig } from '@app/shared/config';
import { TwitchPlatformService } from '@app/streaming-platforms/infrastructure/twitch/twitch-platform.service';

@ApiTags('Twitch Auth')
@Controller('twitch/auth')
@Public()
export class TwitchAuthController {
  private readonly clientAuthUserUrl: string;
  private readonly clientErrorUrl: string;

  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly authService: AuthService
  ) {
    this.clientAuthUserUrl = publicRuntimeConfig.client.authUserRedirectUrl;
    this.clientErrorUrl = publicRuntimeConfig.client.errorRedirectUrl;
  }

  @ApiOperation({ summary: 'Redirect to Twitch authorization URL' })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Redirect to URK after Twitch Authorization',
    type: String,
    required: false
  })
  @Get('redirect')
  @HttpCode(200)
  public redirectToTwitchAuth(
    @Query('redirect_url') redirectUrl: string | undefined
  ) {
    const authRedirectUrl = this.twitchService.getAuthUrl(redirectUrl);
    return formatedHttpResponse({
      success: true,
      data: { url: authRedirectUrl }
    });
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
  @Get('callback')
  public async authCallback(
    @Query('code') code: string,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Res({ passthrough: true }) response: Response
  ) {
    if (error && errorDescription) {
      return formatedHttpResponse({ success: false, error: errorDescription });
    }

    const platformTokens = await this.twitchService.exchangeCodeToToken(code);

    const platformUser = await this.twitchService.getUser({
      accessToken: platformTokens.accessToken
    });
    if (!platformUser) {
      const errosMessage = 'Not found Twitch User by Access Token';
      return formatedHttpResponse({ success: false, error: errosMessage });
    }

    const tokens = await this.twitchService.authUserByPlatform(
      platformTokens,
      platformUser
    );
    if (!tokens) {
      return;
    }
    this.authService.insertTokensInResponse(response, tokens);
    return formatedHttpResponse({ success: true });
  }

  @ApiOperation({ summary: 'Refresh Twitch user tokens' })
  @Post('refresh')
  @HttpCode(200)
  public async refreshUserTokens(@Query('refresh_token') refreshToken: string) {
    const tokens = await this.twitchService.refreshUserToken(refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
