import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { AuthService, Public } from '@app/auth';
import { formatedHttpResponse } from '@app/shared/http';
import { publicRuntimeConfig } from '@app/shared/config';
import { YoutubePlatformService } from '@app/streaming-platforms/infrastructure/youtube/youtube-patform.service';

@ApiTags('Youtube Auth')
@Controller('youtube/auth')
@Public()
export class YoutubeAuthController {
  private readonly clientAuthUserUrl: string;
  private readonly clientErrorUrl: string;

  constructor(
    private readonly youtubeService: YoutubePlatformService,
    private readonly authService: AuthService
  ) {
    this.clientAuthUserUrl = publicRuntimeConfig.client.authUserRedirectUrl;
    this.clientErrorUrl = publicRuntimeConfig.client.errorRedirectUrl;
  }

  @ApiOperation({ summary: 'Redirect to Youtube authorization URL' })
  @Get('redirect')
  @HttpCode(200)
  public redirectToYoutubeAuth() {
    const authRedirectUrl = this.youtubeService.getAuthUrl();
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
    @Res() response: Response
  ) {
    if (error) {
      const redirectUrl = new URL(this.clientErrorUrl);
      redirectUrl.searchParams.append('message', error);
      response.redirect(redirectUrl.toString());
      return;
    }

    const platformTokens = await this.youtubeService.exchangeCodeToToken(code);

    const platformUser = await this.youtubeService.getUser({
      accessToken: platformTokens.accessToken
    });
    if (!platformUser) {
      const redirectUrl = new URL(this.clientErrorUrl);
      redirectUrl.searchParams.append(
        'message',
        'Not found Youtube User by Access Token'
      );
      response.redirect(redirectUrl.toString());
      return;
    }

    const tokens = await this.youtubeService.authUserByPlatform(
      platformTokens,
      platformUser
    );
    if (!tokens) {
      return;
    }
    this.authService.insertTokensInResponse(response, tokens);
    response.redirect(this.clientAuthUserUrl);
  }

  @ApiOperation({ summary: 'Refresh Youtube user tokens' })
  @Post('refresh')
  @HttpCode(200)
  public async refreshUserTokens(@Query('refresh_token') refreshToken: string) {
    const tokens = await this.youtubeService.refreshUserToken(refreshToken);
    return formatedHttpResponse({ success: true, data: tokens });
  }
}
