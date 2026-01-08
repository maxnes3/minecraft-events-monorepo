import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TwitchPlatformService } from '../infrastructure/twitch-platform.service';
import { LoggerService } from '@/shared/logger';
import { TwitchChatAnnouncementRequest } from '../infrastructure/dto/request/twitch-chat-announcment.request';
import { publicRuntimeConfig } from '@/shared/config';

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
    @Body() data: TwitchChatAnnouncementRequest
  ) {
    this.logger.debug('Sending chat announcement via TwitchPlatformService');
    await this.twitchService.sendChatAnnouncement(accessToken, data);
  }
}
