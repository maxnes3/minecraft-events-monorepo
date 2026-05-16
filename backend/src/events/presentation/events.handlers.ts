import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  WebSocketEventsBusService,
  WebSocketHandler,
  WebSocketSubscribeEvents
} from '@app/websocket';
import { UsersService } from '@app/users';
import { LoggerService } from '@app/shared/logger';
import { EventsService } from '../application/events.service';
import { EventsVotingStartDTO } from '../application/dto/events-voting-start.dto';

@Injectable()
export class EventsHandlers implements OnModuleInit {
  constructor(
    private readonly eventsService: EventsService,
    private readonly usersService: UsersService,
    private readonly websocketEventsBusService: WebSocketEventsBusService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(EventsHandlers.name);
  }

  public onModuleInit() {
    this.websocketEventsBusService.registerHandler<EventsVotingStartDTO>(
      WebSocketSubscribeEvents.EVENTS_VOTING_START,
      this.handleStartVoting.bind(this)
    );
  }

  public handleStartVoting: WebSocketHandler<EventsVotingStartDTO> = async (
    payload
  ) => {
    const platformData =
      await this.usersService.getPlatformDataByUserIdAndPlatformName(
        payload.userId,
        payload.data.platform
      );
    if (!platformData) {
      this.logger.error(`Platform data for user ${payload.userId} not found`);
      return { success: false };
    }

    const result = await this.eventsService.startVotingForEvents(
      payload.userId,
      payload.data,
      {
        accessToken: platformData.auth.accessToken,
        platformId: platformData.id
      }
    );
    return {
      success: Boolean(result)
    };
  };
}
