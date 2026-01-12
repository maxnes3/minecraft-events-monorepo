import { Module } from '@nestjs/common';
import { UsersModule } from '@/users';
import { TwitchAuthController } from './presentation/twitch/twitch-auth.controller';
import { TwitchChatController } from './presentation/twitch/twitch-chat.controller';
import { TwitchPlatformService } from './infrastructure/twitch/twitch-platform.service';
import { TwitchPollsController } from './presentation/twitch/twitch-polls.controller';
import { StreamingPlatformsFactory } from './infrastructure/streaming-platforms.factory';

@Module({
  imports: [UsersModule],
  controllers: [
    TwitchAuthController,
    TwitchPollsController,
    TwitchChatController
  ],
  providers: [TwitchPlatformService, StreamingPlatformsFactory],
  exports: [TwitchPlatformService, StreamingPlatformsFactory]
})
export class StreamingPlatformsModule {}
