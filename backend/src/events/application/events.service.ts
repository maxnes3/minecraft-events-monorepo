import { LoggerService } from '@/shared/logger';
import { TwitchPlatformService } from '@/twitch';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly twitchService: TwitchPlatformService
  ) {
    this.logger.setContext(EventsService.name);
  }

  public getEventsHistory() {
    // Implementation for retrieving events history
  }
}
