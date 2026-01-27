import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { formatedHttpResponse } from '@/shared/http';
import { EventsService } from '../application/events.service';
import { EventAnnouncementDTO } from '../application/dto/event-announcement.dto';
import { EventCompleteDTO } from '../application/dto/event-complete.dto';
import { EventStartDTO } from '../application/dto/event-start.dto';
import { User } from '@/auth';
import { UsersService } from '@/users';
import { publicRuntimeConfig } from '@/shared/config';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Events Launch')
@Controller('events')
export class EventsLaunchController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly usersService: UsersService
  ) {}

  @ApiOperation({ summary: 'Start event' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @ApiBody({ type: EventStartDTO })
  @Post('/:id/start')
  @HttpCode(200)
  public async startEvent(
    @User('sub') userId: string,
    @Param('id') eventId: string,
    @Body() data: EventStartDTO
  ) {
    const userPlatformData =
      await this.usersService.getPlatformDataByUserIdAndPlatformName(
        userId,
        data.platform
      );
    if (!userPlatformData) {
      return formatedHttpResponse({ success: false });
    }
    const {
      id: platformId,
      auth: { accessToken }
    } = userPlatformData;
    const success = await this.eventsService.startEvent(eventId, data, {
      accessToken,
      platformId
    });
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Complete event' })
  @ApiParam({ name: 'id', description: 'Event Id', type: String })
  @ApiBody({ type: EventCompleteDTO })
  @Post('/:id/complete')
  @HttpCode(200)
  public async completeEvent(
    @User('sub') userId: string,
    @Param('id') eventId: string,
    @Body() data: EventCompleteDTO
  ) {
    const userPlatformData =
      await this.usersService.getPlatformDataByUserIdAndPlatformName(
        userId,
        data.platform
      );
    if (!userPlatformData) {
      return formatedHttpResponse({ success: false });
    }
    const {
      id: platformId,
      auth: { accessToken }
    } = userPlatformData;
    const success = await this.eventsService.completeEvent(eventId, data, {
      accessToken,
      platformId
    });
    return formatedHttpResponse({ success });
  }

  @ApiOperation({ summary: 'Send event announcement' })
  @Post('send/announcement')
  @HttpCode(200)
  public async sendEventAnnouncement(
    @User('sub') userId: string,
    @Body() data: EventAnnouncementDTO
  ) {
    const userPlatformData =
      await this.usersService.getPlatformDataByUserIdAndPlatformName(
        userId,
        data.platform
      );
    if (!userPlatformData) {
      return formatedHttpResponse({ success: false });
    }
    const {
      id: platformId,
      auth: { accessToken }
    } = userPlatformData;
    const success = await this.eventsService.sendEventAnnouncement(data, {
      accessToken,
      platformId
    });
    return formatedHttpResponse({ success });
  }
}
