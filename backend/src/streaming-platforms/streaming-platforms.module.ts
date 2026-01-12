import { Module } from '@nestjs/common';
import { TwitchAuthController } from './presentation/twitch/twitch-auth.controller';
import { TwitchChatController } from './presentation/twitch/twitch-chat.controller';
import { TwitchPlatformService } from './infrastructure/twitch/twitch-platform.service';
import { StreamingPlatformsFactory } from './infrastructure/streaming-platforms.factory';
import { TwitchMapper } from './infrastructure/twitch/mappers/twitch.mappers';

@Module({
  controllers: [TwitchAuthController, TwitchChatController],
  providers: [TwitchPlatformService, TwitchMapper, StreamingPlatformsFactory],
  exports: [StreamingPlatformsFactory]
})
export class StreamingPlatformsModule {}
