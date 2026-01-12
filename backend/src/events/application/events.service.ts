import { Injectable } from '@nestjs/common';
import { I18nClient } from '@/shared/i18n';
import { LoggerService } from '@/shared/logger';
import { publicRuntimeConfig } from '@/shared/config';
import {
  StreamingPlatforms,
  StreamingPlatformsFactory,
  type IStreamingPlatformAuthDTO
} from '@/streaming-platforms';
import { EventAnnouncementDTO } from './dto/event-announcement.dto';
import { EventStatus } from './dto/events.enums';
import { UsersService } from '@/users';
import { EventDTO } from './dto/event.dto';
import { EventCreateDTO } from './dto/event-create.dto';
import { EventsRepository } from '../infrastructure/persistence/mongo/repositories/events.repository';
import { EventEntity } from '../domain/entities/event.entity';
import { EventUpdateDTO } from './dto/event-update.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly streamingFactory: StreamingPlatformsFactory,
    private readonly eventsRepository: EventsRepository,
    private readonly usersService: UsersService,
    private readonly i18nClient: I18nClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(EventsService.name);
  }

  public async getEventById(eventId: string): Promise<EventDTO | null> {
    const event = await this.eventsRepository.findById(eventId);
    if (!event) {
      this.logger.error(`Event with ID ${eventId} not found`);
      return null;
    }

    this.logger.debug(`Event with ID ${eventId} is found`);
    return event.toDTO();
  }

  public async getEventsByUserId(userId: string): Promise<EventDTO[] | null> {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }

    const events = await this.eventsRepository.findByUserId(userId);
    if (!events) {
      this.logger.error(`Events with user ID ${userId} not found`);
      return null;
    }

    return events.map((event) => event.toDTO());
  }

  public async createEvent(data: EventCreateDTO): Promise<EventDTO | null> {
    this.logger.debug(`Creating event with name: ${data.name}`);
    const user = await this.usersService.getUserById(data.owner);
    if (!user) {
      this.logger.error(`User with ID ${data.owner} not found`);
      return null;
    }

    const event = EventEntity.create(data.owner, data.name, data.duration);
    await this.eventsRepository.save(event);

    this.logger.debug(`Event created with ID: ${event.getId()}`);
    return event.toDTO();
  }

  public async updateEventById(
    eventId: string,
    data: EventUpdateDTO
  ): Promise<EventDTO | null> {
    const event = await this.eventsRepository.findById(eventId);
    if (!event) {
      this.logger.error(`Event with ID ${eventId} not found`);
      return null;
    }

    event.setName(data.name ?? event.getName());
    event.setDuration(data.duration ?? event.getDuration());

    await this.eventsRepository.update(event);
    return event.toDTO();
  }

  public async startEvent(
    eventId: string,
    authData: IStreamingPlatformAuthDTO
  ): Promise<boolean> {
    await this.sendEventAnnouncement(
      { status: EventStatus.STARTED, platform: StreamingPlatforms.TWITCH },
      authData
    );
    return true;
  }

  public async completeEvent(
    eventId: string,
    authData: IStreamingPlatformAuthDTO
  ): Promise<boolean> {
    await this.sendEventAnnouncement(
      { status: EventStatus.COMPLETED, platform: StreamingPlatforms.TWITCH },
      authData
    );
    return true;
  }

  public async sendEventAnnouncement(
    data: EventAnnouncementDTO,
    authData: IStreamingPlatformAuthDTO
  ): Promise<boolean> {
    try {
      const message = this.getEventAnnouncementMessage(
        data.status,
        {},
        data.lang
      );
      const response = await this.streamingFactory
        .getService(data.platform)
        .sendChatAnnouncement({ message }, authData);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send chat announcement ${error}`);
      return false;
    }
  }

  public async deleteEventById(eventId: string): Promise<boolean> {
    this.logger.debug(`Deleting event with ID: ${eventId}`);

    const event = await this.eventsRepository.findById(eventId);
    if (!event) {
      this.logger.error(`Event with ID ${eventId} not found`);
      return false;
    }

    await this.eventsRepository.delete(eventId);
    this.logger.debug(`Event deleted with ID: ${eventId}`);
    return true;
  }

  private getEventAnnouncementMessage(
    status: EventStatus,
    { ...args },
    lang: string = publicRuntimeConfig.i18n.fallbackLanguage
  ): string {
    const messageKeys: Record<EventStatus, string> = {
      [EventStatus.STARTED]: 'announcements.started.command',
      [EventStatus.ONGOING]: '',
      [EventStatus.COMPLETED]: 'announcements.completed'
    };
    const translateData = { lang, ...args };
    return this.i18nClient.translate(messageKeys[status], translateData);
  }
}
