import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamingPlatformsModule } from '@/streaming-platforms';
import { UsersModule } from '@/users';
import { EventsManageController } from './presentation/events-manage.controller';
import { EventsLaunchController } from './presentation/events-launch.controller';
import { EventsService } from './application/events.service';
import { EventMapper } from './infrastructure/persistence/mappers/event.mapper';
import {
  Event,
  EventSchema
} from './infrastructure/persistence/mongo/schemas/event.schema';
import { EventsRepository } from './infrastructure/persistence/mongo/repositories/events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    StreamingPlatformsModule,
    UsersModule
  ],
  controllers: [EventsManageController, EventsLaunchController],
  providers: [EventsService, EventMapper, EventsRepository]
})
export class EventsModule {}
