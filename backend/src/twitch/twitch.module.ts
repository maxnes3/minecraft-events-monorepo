import { Module } from '@nestjs/common';
import { TwitchAuthController } from './presentation/twitch-auth.controller';
import { TwitchPlatformService } from './infrastructure/twitch-platform.service';

@Module({
  controllers: [TwitchAuthController],
  providers: [TwitchPlatformService]
})
export class TwitchModule {}
