import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamingPlatformsModule } from '@app/streaming-platforms';
import { UsersModule } from '@app/users';
import { EventsManageController } from './presentation/events-manage.controller';
import { EventsLaunchController } from './presentation/events-launch.controller';
import { EventsVotingController } from './presentation/events-voting.controller';
import { EventsService } from './application/events.service';
import { EventMapper } from './infrastructure/persistence/mongo/mappers/event.mapper';
import {
  Event,
  EventSchema
} from './infrastructure/persistence/mongo/schemas/event.schema';
import { EventsRepository } from './infrastructure/persistence/mongo/repositories/events.repository';
import { EventPresentationMapper } from './presentation/mappers/event-presentation.mapper';
import { WebSocketModule } from '@app/websocket';
import { EventsHandlers } from './presentation/events.handlers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    StreamingPlatformsModule,
    UsersModule,
    WebSocketModule
  ],
  controllers: [
    EventsManageController,
    EventsLaunchController,
    EventsVotingController
  ],
  providers: [
    EventsService,
    EventMapper,
    EventPresentationMapper,
    EventsRepository,
    EventsHandlers
  ],
  exports: [EventsService, EventsHandlers]
})
export class EventsModule {}
