import { Module } from '@nestjs/common';
import { LoggerModule } from './shared/logger';
import { HttpModule } from './shared/http';
import { TwitchModule } from './twitch';
import { EventsModule } from './events';

@Module({
  imports: [HttpModule, LoggerModule, TwitchModule, EventsModule]
})
export class AppModule {}
