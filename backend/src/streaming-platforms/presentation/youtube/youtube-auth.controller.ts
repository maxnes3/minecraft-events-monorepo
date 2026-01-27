import { publicRuntimeConfig } from '@/shared/config';
import { formatedHttpResponse } from '@/shared/http';
import { YoutubePlatformService } from '@/streaming-platforms/infrastructure/youtube/youtube-patform.service';
import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '@/auth';
import type { Response } from 'express';

@ApiTags('Youtube Auth')
@Controller('youtube/auth')
@Public()
export class YoutubeAuthController {
  constructor(private readonly youtubeService: YoutubePlatformService) {}

  @ApiOperation({ summary: 'Redirect to Youtube authorization URL' })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Redirect to this URL after Youtube authorization',
    required: false
  })
  @Get('redirect')
  public redirectToYoutubeAuth(
    @Query('redirect_url') redirectUrl: string | undefined,
    @Res() response: Response
  ) {
    const authRedirectUrl = this.youtubeService.getAuthUrl(redirectUrl);
    response.redirect(authRedirectUrl);
  }

  @ApiOperation({ summary: 'Youtube authorization callback' })
  @ApiQuery({ name: 'code', required: true, description: 'Authorization code' })
  @ApiQuery({
    name: 'error',
    required: false,
    description: 'Error code if failed'
  })
  @Get('callback')
  public async authCallback(
    @Query('code') code: string,
    @Query('error') error: string | undefined,
    @Query('is_client') isClient: boolean,
    @Res() response: Response
  ) {
    if (error) {
      if (!isClient) {
        response.redirect(`/error?message=${encodeURIComponent(error)}`);
        return;
      }
      return formatedHttpResponse({ success: false, error });
    }

    const tokens = await this.youtubeService.exchangeCodeToToken(code);

    const userData = await this.youtubeService.getUser({
      accessToken: tokens.accessToken
    });

    if (!userData) {
      return formatedHttpResponse({ success: false });
    }

    const authData = await this.youtubeService.authUserByPlatform(
      tokens,
      userData
    );
    if (!isClient) {
      response.redirect(`/${publicRuntimeConfig.application.apiPrefix}`);
      return;
    }
    return formatedHttpResponse({ success: true, data: authData });
  }

  @ApiOperation({ summary: 'Refresh Youtube user tokens' })
  @Post('refresh')
  @HttpCode(200)
  public async refreshUserTokens(@Query('refresh_token') refreshToken: string) {
    const tokens = await this.youtubeService.refreshUserToken(refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
