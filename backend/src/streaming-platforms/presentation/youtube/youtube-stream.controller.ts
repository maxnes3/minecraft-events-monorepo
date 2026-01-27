import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/shared/logger';
import { YoutubePlatformService } from '@/streaming-platforms/infrastructure/youtube/youtube-patform.service';
import { YoutubeChatAnnouncementDTO } from '@/streaming-platforms/infrastructure/youtube/dto/youtube-chat-announcement.dto';
import { formatedHttpResponse } from '@/shared/http';

@ApiTags('Youtube Stream')
@Controller('youtube/stream')
export class YoutubeStreamController {
  constructor(
    private readonly youtubeService: YoutubePlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(YoutubeStreamController.name);
  }

  @ApiOperation({ summary: 'Get Youtube stream' })
  @Get('inlive')
  @HttpCode(200)
  public async getStreamInLive(@Query('accessToken') accessToken: string) {
    const stream = await this.youtubeService.getStreamInLive({ accessToken });
    if (!stream) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: stream });
  }

  @ApiOperation({ summary: 'Send a chat announcement to Youtube channel' })
  @Post('send/announcement')
  @HttpCode(200)
  public async sendChatAnnouncement(
    @Query('access_token') accessToken: string,
    @Query('live_chat_id') liveChatId: string,
    @Body() data: YoutubeChatAnnouncementDTO
  ) {
    const success = await this.youtubeService.sendChatAnnouncement(data, {
      accessToken,
      platformProperties: { liveChatId }
    });
    return formatedHttpResponse({ success });
  }
}
