import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsVotingStartDTO } from '../application/dto/events-voting-start.dto';
import { EventsService } from '../application/events.service';
import { UsersService } from '@/users';
import { User } from '@/auth';
import { formatedHttpResponse } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';

@ApiBearerAuth(publicRuntimeConfig.jwt.authorizationHeader)
@ApiTags('Events Voting')
@Controller('events/voting')
export class EventsVotingController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly usersService: UsersService
  ) {}

  @ApiOperation({ summary: 'Start voting for an event' })
  @Post('/start')
  @HttpCode(200)
  public async startVoting(
    @User('sub') owner: string,
    @Body() data: EventsVotingStartDTO
  ) {
    const userPlatformData =
      await this.usersService.getPlatformDataByUserIdAndPlatformName(
        owner,
        data.platform
      );
    if (!userPlatformData) {
      return formatedHttpResponse({ success: false });
    }

    const {
      id: platformId,
      auth: { accessToken }
    } = userPlatformData;
    const result = await this.eventsService.startVotingForEvents(owner, data, {
      platformId,
      accessToken
    });
    if (!result) {
      return formatedHttpResponse({ success: false });
    }
    return formatedHttpResponse({ success: true, data: result });
  }
}
