import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/shared/logger';
import { publicRuntimeConfig } from '@/shared/config';
import { TwitchChatAnnouncementDTO } from '../../infrastructure/twitch/dto/request/twitch-chat-announcment.request';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';

@ApiTags('Twitch Chat')
@Controller('twitch/chat')
export class TwitchChatController {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(TwitchChatController.name);
  }

  @ApiOperation({ summary: 'Send a chat announcement to Twitch channel' })
  @Post('send/announcement')
  @HttpCode(200)
  public async sendChatAnnouncement(
    @Query(publicRuntimeConfig.twitch.accessTokenName) accessToken: string,
    @Query(publicRuntimeConfig.twitch.broadcasterIdName) broadcasterId: string,
    @Body() data: TwitchChatAnnouncementDTO
  ) {
    this.logger.debug('Sending chat announcement via TwitchPlatformService');
    await this.twitchService.sendChatAnnouncement(data, {
      accessToken,
      broadcasterId
    });
  }
}
