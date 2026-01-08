import { Module } from '@nestjs/common';
import { TwitchAuthController } from './presentation/twitch-auth.controller';
import { TwitchChatController } from './presentation/twitch-chat.controller';
import { TwitchPlatformService } from './infrastructure/twitch-platform.service';
import { TwitchPollsController } from './presentation/twitch-polls.controller';

@Module({
  controllers: [
    TwitchAuthController,
    TwitchPollsController,
    TwitchChatController
  ],
  providers: [TwitchPlatformService],
  exports: [TwitchPlatformService]
})
export class TwitchModule {}
