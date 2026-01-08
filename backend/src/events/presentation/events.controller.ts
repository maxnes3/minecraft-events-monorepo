import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/shared/logger';
import { EventsService } from '../application/events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(EventsController.name);
  }

  @ApiOperation({ summary: 'Get events history' })
  @Get('history')
  @HttpCode(200)
  public getEventsHistory() {
    this.logger.debug('Fetching events history');
    this.eventsService.getEventsHistory();
  }
}
