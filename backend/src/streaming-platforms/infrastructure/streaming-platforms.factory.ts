import { Injectable, NotFoundException } from '@nestjs/common';
import { StreamingPlatforms } from './streaming-platforms.enums';
import { IStreamingPlatformService } from '../domain/interfaces/streaming-platform-service.interface';
import { TwitchPlatformService } from './twitch/twitch-platform.service';
import { YoutubePlatformService } from './youtube/youtube-patform.service';

@Injectable()
export class StreamingPlatformsFactory {
  constructor(
    private readonly twitchService: TwitchPlatformService,
    private readonly youtubeService: YoutubePlatformService
  ) {}

  public getService(platform: StreamingPlatforms): IStreamingPlatformService {
    switch (platform) {
      case StreamingPlatforms.TWITCH:
        return this.twitchService;
      case StreamingPlatforms.YOUTUBE:
        return this.youtubeService;
      default:
        throw new NotFoundException(
          `Streaming platform ${String(platform)} is not supported`
        );
    }
  }
}
