import { Module } from '@nestjs/common';
import { StreamingPlatformsModule } from '@/streaming-platforms';
import { EventsController } from './presentation/events.controller';
import { EventsService } from './application/events.service';

@Module({
  imports: [StreamingPlatformsModule],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
