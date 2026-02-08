import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@app/shared/logger';
import { TwitchSendMessageDTO } from '../../infrastructure/twitch/dto/twitch-send-message.dto';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';
import { formatedHttpResponse } from '@app/shared/http';

@ApiTags('Twitch Stream')
@Controller('twitch/stream')
export class TwitchStreamController {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(TwitchStreamController.name);
  }

  @ApiOperation({ summary: 'Get Twitch stream' })
  @Get('inlive')
  @HttpCode(200)
  public async getStreamInLive(@Query('access_token') accessToken: string) {
    const stream = await this.twitchService.getStreamInLive({ accessToken });
    if (!stream) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: stream });
  }

  @ApiOperation({ summary: 'Send a chat message to Twitch channel' })
  @Post('send/message')
  @HttpCode(200)
  public async sendChatAnnouncement(
    @Query('access_token') accessToken: string,
    @Query('broadcaster_id') broadcasterId: string,
    @Body() data: TwitchSendMessageDTO
  ) {
    const success = await this.twitchService.sendMessage(data, {
      accessToken,
      platformId: broadcasterId
    });
    return formatedHttpResponse({ success });
  }
}
