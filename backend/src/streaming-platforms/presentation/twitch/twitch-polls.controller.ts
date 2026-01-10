import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TwitchPlatformService } from '../../infrastructure/twitch/twitch-platform.service';
import { LoggerService } from '@/shared/logger';
import { TwitchStartPollRequest } from '../../infrastructure/twitch/dto/request/twitch-start-poll.request';
import { publicRuntimeConfig } from '@/shared/config';

@ApiTags('Twitch Polls')
@Controller('twitch/polls')
export class TwitchPollsController {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(TwitchPollsController.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get poll on Twitch channel' })
  @HttpCode(200)
  public async getActivePoll(
    @Query(publicRuntimeConfig.twitch.accessTokenName) accessToken: string,
    @Query(publicRuntimeConfig.twitch.broadcasterIdName) broadcasterId: string,
    @Query('pollId') pollId: string
  ) {
    this.logger.debug('Fetching active polls via TwitchPlatformService');
    const poll = await this.twitchService.getPoll(
      accessToken,
      broadcasterId,
      pollId
    );
    return poll;
  }

  @ApiOperation({ summary: 'Start a poll on Twitch channel' })
  @Post('start')
  @HttpCode(200)
  public async startPoll(
    @Query(publicRuntimeConfig.twitch.accessTokenName) accessToken: string,
    @Body() data: TwitchStartPollRequest
  ) {
    this.logger.debug('Starting poll via TwitchPlatformService');
    await this.twitchService.startPoll(accessToken, data);
  }
}
