import { Injectable } from '@nestjs/common';
import { I18nClient } from '@/shared/i18n';
import { LoggerService } from '@/shared/logger';
import { publicRuntimeConfig } from '@/shared/config';
import {
  StreamingPlatformsFactory,
  type IAuthDTO
} from '@/streaming-platforms';
import { EventAnnouncementDTO } from './dto/request/event-announcement.request';
import { EventStatus } from './dto/events.enums';

@Injectable()
export class EventsService {
  constructor(
    private readonly streamingFactory: StreamingPlatformsFactory,
    private readonly i18nClient: I18nClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(EventsService.name);
  }

  public startEvent() {}

  public getEventStatus() {}

  public changeEventStatus() {}

  public async sendEventAnnouncement(
    data: EventAnnouncementDTO,
    authData: IAuthDTO
  ) {
    const message = this.getEventAnnouncementMessage(data.status, {});
    await this.streamingFactory
      .getService(data.platform)
      .sendChatAnnouncement({ message }, authData);
  }

  public async getEventsHistory() {
    // Implementation for retrieving events history
  }

  private getEventAnnouncementMessage(
    status: EventStatus,
    { ...args },
    lang: string = publicRuntimeConfig.i18n.fallbackLanguage
  ): string {
    if (status === EventStatus.STARTED) {
      return this.i18nClient.translate('announcements.started.command', {
        lang,
        ...args
      });
    }
    return this.i18nClient.translate('announcements.completed', {
      lang,
      ...args
    });
  }
}
