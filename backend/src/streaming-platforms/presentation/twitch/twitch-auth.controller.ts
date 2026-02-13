import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { formatedHttpResponse } from '@app/shared/http';
import { Public } from '@app/auth';

@ApiTags('Twitch Auth')
@Controller('twitch/auth')
@Public()
export class TwitchAuthController {
  constructor(private readonly twitchService: TwitchPlatformService) {}

  @ApiOperation({ summary: 'Redirect to Twitch authorization URL' })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Redirect to Client URL after Twitch authorization',
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
    @Query('error_description') errorDescription: string | undefined
  ) {
    if (error && errorDescription) {
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
