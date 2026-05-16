import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { AuthService, Public } from '@app/auth';
import { formatedHttpResponse } from '@app/shared/http';
import { YoutubePlatformService } from '@app/streaming-platforms/infrastructure/youtube/youtube-patform.service';

@ApiTags('Youtube Auth')
@Controller('youtube/auth')
@Public()
export class YoutubeAuthController {
  constructor(
    private readonly youtubeService: YoutubePlatformService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: 'Redirect to Youtube authorization URL' })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Redirect to URK after Youtube Authorization',
    type: String,
    required: false
  })
  @Get('redirect')
  @HttpCode(200)
  public redirectToYoutubeAuth(
    @Query('redirect_url') redirectUrl: string | undefined
  ) {
    const authRedirectUrl = this.youtubeService.getAuthUrl(redirectUrl);
    return formatedHttpResponse({
      success: true,
      data: { url: authRedirectUrl }
    });
  }

  @ApiOperation({ summary: 'Youtube authorization callback' })
  @ApiQuery({ name: 'code', required: true, description: 'Authorization code' })
  @ApiQuery({
    name: 'error',
    required: false,
    description: 'Error code if failed'
  })
  @Get('callback')
  @HttpCode(200)
  public async authCallback(
    @Query('code') code: string,
    @Query('error') error: string | undefined,
    @Res({ passthrough: true }) response: Response
  ) {
    if (error) {
      return formatedHttpResponse({ success: false, error });
    }

    const platformTokens = await this.youtubeService.exchangeCodeToToken(code);

    const platformUser = await this.youtubeService.getUser({
      accessToken: platformTokens.accessToken
    });
    if (!platformUser) {
      const errosMessage = 'Not found Youtube User by Access Token';
      return formatedHttpResponse({ success: false, error: errosMessage });
    }

    const tokens = await this.youtubeService.authUserByPlatform(
      platformTokens,
      platformUser
    );
    if (!tokens) {
      return;
    }
    this.authService.insertTokensInResponse(response, tokens);
    return formatedHttpResponse({ success: true });
  }

  @ApiOperation({ summary: 'Refresh Youtube user tokens' })
  @Post('refresh')
  @HttpCode(200)
  public async refreshUserTokens(@Query('refresh_token') refreshToken: string) {
    const tokens = await this.youtubeService.refreshUserToken(refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
