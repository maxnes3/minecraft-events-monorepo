import { Module } from '@nestjs/common';
import { UsersModule } from '@app/users';
import { AuthModule } from '@app/auth';
import { WebSocketModule } from '@app/websocket';
import { TwitchAuthController } from './presentation/twitch/twitch-auth.controller';
import { TwitchStreamController } from './presentation/twitch/twitch-stream.controller';
import { TwitchPlatformService } from './infrastructure/twitch/twitch-platform.service';
import { StreamingPlatformsFactory } from './infrastructure/streaming-platforms.factory';
import { TwitchMapper } from './infrastructure/twitch/mappers/twitch.mappers';
import { YoutubePlatformService } from './infrastructure/youtube/youtube-patform.service';
import { YoutubeMapper } from './infrastructure/youtube/mappers/youtube.mappers';
import { YoutubeAuthController } from './presentation/youtube/youtube-auth.controller';
import { YoutubeStreamController } from './presentation/youtube/youtube-stream.controller';
import { StreamingPlatformsHandlers } from './presentation/streaming-platforms.handlers';

@Module({
  imports: [AuthModule, UsersModule, WebSocketModule],
  controllers: [
    TwitchAuthController,
    TwitchStreamController,
    YoutubeAuthController,
    YoutubeStreamController
  ],
  providers: [
    TwitchPlatformService,
    TwitchMapper,
    YoutubePlatformService,
    YoutubeMapper,
    StreamingPlatformsFactory,
    StreamingPlatformsHandlers
  ],
  exports: [StreamingPlatformsFactory, StreamingPlatformsHandlers]
})
export class StreamingPlatformsModule {}
