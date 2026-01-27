import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/shared/logger';
import { TwitchChatAnnouncementDTO } from '../../infrastructure/twitch/dto/twitch-chat-announcment.request';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';
import { formatedHttpResponse } from '@/shared/http';

@ApiTags('Twitch Stream')
@Controller('twitch/stream')
export class TwitchStreamController {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(TwitchStreamController.name);
  }

  @ApiOperation({ summary: 'Send a chat announcement to Twitch channel' })
  @Post('send/announcement')
  @HttpCode(200)
  public async sendChatAnnouncement(
    @Query('access_token') accessToken: string,
    @Query('broadcaster_id') broadcasterId: string,
    @Body() data: TwitchChatAnnouncementDTO
  ) {
    const success = await this.twitchService.sendChatAnnouncement(data, {
      accessToken,
      platformId: broadcasterId
    });
    return formatedHttpResponse({ success });
  }
}
