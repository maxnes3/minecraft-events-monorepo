import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { formatedHttpResponse } from '@app/shared/http';
import { EventsService } from '../application/events.service';
import { EventCreateDTO } from '../application/dto/event-create.dto';
import { EventUpdateDTO } from '../application/dto/event-update.dto';
import { publicRuntimeConfig } from '@app/shared/config';
import { AuthUser } from '@app/auth';
import { EventPresentationMapper } from './mappers/event-presentation.mapper';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Events Manage')
@Controller('events')
export class EventsManageController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventPresentationMapper: EventPresentationMapper
  ) {}

  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @Get('owner/:id')
  @HttpCode(200)
  public async getEventById(@Param('id') eventId: string) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: this.eventPresentationMapper.toPresentationDTO(event)
    });
  }

  @ApiOperation({ summary: 'Get events by owner id' })
  @Get('/owner')
  @HttpCode(200)
  public async getEventsByOwnerId(@AuthUser('sub') ownerId: string) {
    const events = await this.eventsService.getEventsByOwnerId(ownerId);
    if (!events || events.length === 0) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: events.map((e) => this.eventPresentationMapper.toPresentationDTO(e))
    });
  }

  @ApiOperation({ summary: 'Get events by owner id and game' })
  @ApiQuery({ name: 'name', type: String, required: true })
  @Get('/owner/game')
  @HttpCode(200)
  public async getEventsByOwnerIdAndGame(
    @AuthUser('sub') userId: string,
    @Query('name') game: string
  ) {
    const events = await this.eventsService.getEventsByOwnerIdAndGame(
      userId,
      game
    );
    if (!events || events.length === 0) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: events.map((e) => this.eventPresentationMapper.toPresentationDTO(e))
    });
  }

  @ApiOperation({ summary: 'Create new event' })
  @ApiBody({ type: EventCreateDTO })
  @Post('/owner')
  @HttpCode(200)
  public async createEvent(
    @AuthUser('sub') owner: string,
    @Body() data: EventCreateDTO
  ) {
    const event = await this.eventsService.createEvent(owner, data);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: this.eventPresentationMapper.toPresentationDTO(event)
    });
  }

  @ApiOperation({ summary: 'Update event by id' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @Put('owner/:id')
  @HttpCode(200)
  public async updateEvent(
    @Param('id') eventId: string,
    @Body() data: EventUpdateDTO
  ) {
    const event = await this.eventsService.updateEventById(eventId, data);
    if (!event) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({
      success: true,
      data: this.eventPresentationMapper.toPresentationDTO(event)
    });
  }

  @ApiOperation({ summary: 'Delete event by id' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @Delete('owner/:id')
  @HttpCode(200)
  public async deleteEventById(@Param('id') eventId: string) {
    const success = await this.eventsService.deleteEventById(eventId);
    return formatedHttpResponse({ success });
  }
}
