import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { formatedHttpResponse } from '@/shared/http';
import { EventsService } from '../application/events.service';
import { EventSendAnnouncementDTO } from '../application/dto/event-send-announcement.dto';
import { EventCompleteDTO } from '../application/dto/event-complete.dto';
import { EventStartDTO } from '../application/dto/event-start.dto';
import { AuthUser } from '@/auth';
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
  @ApiBody({ type: EventStartDTO })
  @Post('/start')
  @HttpCode(200)
  public async startEvent(
    @AuthUser('sub') userId: string,
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
    const result = await this.eventsService.startEvent(data, {
      accessToken,
      platformId
    });
    if (!result) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: result });
  }

  @ApiOperation({ summary: 'Complete event' })
  @ApiBody({ type: EventCompleteDTO })
  @Post('/complete')
  @HttpCode(200)
  public async completeEvent(
    @AuthUser('sub') userId: string,
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
    const result = await this.eventsService.completeEvent(data, {
      accessToken,
      platformId
    });
    if (!result) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: result });
  }

  @ApiOperation({ summary: 'Send event announcement' })
  @Post('send/announcement')
  @HttpCode(200)
  public async sendEventAnnouncement(
    @AuthUser('sub') userId: string,
    @Body() data: EventSendAnnouncementDTO
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
    const result = await this.eventsService.sendEventAnnouncement(data, {
      accessToken,
      platformId
    });
    if (!result) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: result });
  }
}
