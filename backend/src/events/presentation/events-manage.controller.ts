import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { formatedHttpResponse } from '@/shared/http';
import { EventsService } from '../application/events.service';
import { EventCreateDTO } from '../application/dto/event-create.dto';
import { EventUpdateDTO } from '../application/dto/event-update.dto';
import { publicRuntimeConfig } from '@/shared/config';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Events Manage')
@Controller('events')
export class EventsManageController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
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
  @ApiParam({ name: 'id', description: 'User Id', type: String })
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
  @ApiBody({ type: EventCreateDTO })
  @Post()
  @HttpCode(200)
  public async createEvent(@Body() data: EventCreateDTO) {
    const event = await this.eventsService.createEvent(data);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: event });
  }

  @ApiOperation({ summary: 'Update event by id' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @Put('/:id')
  @HttpCode(200)
  public async updateEvent(@Param('id') eventId: string, data: EventUpdateDTO) {
    const event = await this.eventsService.updateEventById(eventId, data);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: event });
  }

  @ApiOperation({ summary: 'Delete event by id' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @Delete('/:id')
  @HttpCode(200)
  public async deleteEventById(@Param('id') eventId: string) {
    const success = await this.eventsService.deleteEventById(eventId);
    return formatedHttpResponse({ success });
  }
}
