import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@app/shared/logger';
import { formatedHttpResponse } from '@app/shared/http';
import { YoutubePlatformService } from '@app/streaming-platforms/infrastructure/youtube/youtube-patform.service';
import { YoutubeSendMessageDTO } from '@app/streaming-platforms/infrastructure/youtube/dto/youtube-send-message.dto';

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
  public async getStreamInLive(@Query('access_token') accessToken: string) {
    const stream = await this.youtubeService.getStreamInLive({ accessToken });
    if (!stream) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: stream });
  }

  @ApiOperation({ summary: 'Send a chat message to Youtube channel' })
  @Post('send/message')
  @HttpCode(200)
  public async sendChatAnnouncement(
    @Query('access_token') accessToken: string,
    @Query('live_chat_id') liveChatId: string,
    @Body() data: YoutubeSendMessageDTO
  ) {
    const success = await this.youtubeService.sendMessage(data, {
      accessToken,
      platformProperties: { liveChatId }
    });
    return formatedHttpResponse({ success });
  }
}
