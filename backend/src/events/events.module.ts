import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { EventsService } from './application/events.service';
import { TwitchModule } from '@/twitch';

@Module({
  imports: [TwitchModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: []
})
export class EventsModule {}
