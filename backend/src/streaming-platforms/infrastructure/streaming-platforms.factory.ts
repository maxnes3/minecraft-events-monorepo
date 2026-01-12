import { Injectable, NotFoundException } from '@nestjs/common';
import { StreamingPlatforms } from './streaming-platforms.enums';
import { IStreamingPlatformService } from '../domain/streaming-platform-service.interface';
import { TwitchPlatformService } from './twitch/twitch-platform.service';

@Injectable()
export class StreamingPlatformsFactory {
  constructor(private readonly twitchService: TwitchPlatformService) {}

  public getService(platform: StreamingPlatforms): IStreamingPlatformService {
    switch (platform) {
      case StreamingPlatforms.TWITCH:
        return this.twitchService;
      default:
        throw new NotFoundException(
          `Streaming platform ${String(platform)} is not supported`
        );
    }
  }
}
