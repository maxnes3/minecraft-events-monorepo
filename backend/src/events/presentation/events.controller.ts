import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/shared/logger';
import { EventsService } from '../application/events.service';
import { EventAnnouncementDTO } from '../application/dto/request/event-announcement.request';
import type { Request } from 'express';
import { publicRuntimeConfig } from '@/shared/config';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(EventsController.name);
  }

  @Post('start')
  @HttpCode(200)
  public startEvent() {
    this.eventsService.startEvent();
  }

  @Get('status')
  @HttpCode(200)
  public getEventStatus() {
    this.eventsService.getEventStatus();
  }

  @Patch('status')
  @HttpCode(200)
  public changeEventStatus() {
    this.eventsService.changeEventStatus();
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
    this.logger.debug('Sending event announcement');
    await this.eventsService.sendEventAnnouncement(data, authData);
  }

  @ApiOperation({ summary: 'Get events history' })
  @Get('history')
  @HttpCode(200)
  public async getEventsHistory() {
    this.logger.debug('Fetching events history');
    await this.eventsService.getEventsHistory();
  }
}
