import { formatedHttpResponse } from '@app/shared/http';
import { YoutubePlatformService } from '@app/streaming-platforms/infrastructure/youtube/youtube-patform.service';
import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/auth';

@ApiTags('Youtube Auth')
@Controller('youtube/auth')
@Public()
export class YoutubeAuthController {
  constructor(private readonly youtubeService: YoutubePlatformService) {}

  @ApiOperation({ summary: 'Redirect to Youtube authorization URL' })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Redirect to Client URL after Youtube authorization',
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
    @Query('error') error: string | undefined
  ) {
    if (error) {
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
