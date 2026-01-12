import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { publicRuntimeConfig } from '@/shared/config';
import { formatedHttpResponse } from '@/shared/http';
import { EventsService } from '../application/events.service';
import { EventAnnouncementDTO } from '../application/dto/event-announcement.dto';
import { EventCreateDTO } from '../application/dto/event-create.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Get event by id' })
  @Get('/:id')
  @HttpCode(200)
  public async getEventById(@Param('id') eventId: string) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: event });
  }

  @ApiOperation({ summary: 'Get events by user id' })
  @Get('/user/:id')
  @HttpCode(200)
  public async getEventsByUserId(@Param('id') userId: string) {
    const events = await this.eventsService.getEventsByUserId(userId);
    if (!events) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: events });
  }

  @ApiOperation({ summary: 'Create new event' })
  @Post()
  @HttpCode(200)
  public async createEvent(@Body() data: EventCreateDTO) {
    const event = await this.eventsService.createEvent(data);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: event });
  }

  @ApiOperation({ summary: 'Start event' })
  @Post('/:id/start')
  @HttpCode(200)
  public async startEvent(
    @Query(publicRuntimeConfig.twitch.accessTokenName) accessToken: string,
    @Query(publicRuntimeConfig.twitch.broadcasterIdName) broadcasterId: string,
    @Param('id') eventId: string
  ) {
    const authData = { accessToken, broadcasterId };
    const success = await this.eventsService.startEvent(eventId, authData);
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Complete event' })
  @Post('/:id/complete')
  @HttpCode(200)
  public async completeEvent(
    @Query(publicRuntimeConfig.twitch.accessTokenName) accessToken: string,
    @Query(publicRuntimeConfig.twitch.broadcasterIdName) broadcasterId: string,
    @Param('id') eventId: string
  ) {
    const authData = { accessToken, broadcasterId };
    const success = await this.eventsService.completeEvent(eventId, authData);
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Send event announcement' })
  @Post('send/announcement')
  @HttpCode(200)
  public async sendEventAnnouncement(
    @Query(publicRuntimeConfig.twitch.accessTokenName) accessToken: string,
    @Query(publicRuntimeConfig.twitch.broadcasterIdName) broadcasterId: string,
    @Body() data: EventAnnouncementDTO
  ) {
    const authData = { accessToken, broadcasterId };
    const success = await this.eventsService.sendEventAnnouncement(
      data,
      authData
    );
    return formatedHttpResponse({ success });
  }
}
