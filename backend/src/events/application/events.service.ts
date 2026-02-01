import { Injectable } from '@nestjs/common';
import { I18nClient } from '@/shared/i18n';
import { LoggerService } from '@/shared/logger';
import { publicRuntimeConfig } from '@/shared/config';
import {
  StreamingPlatforms,
  StreamingPlatformsFactory,
  type StreamingPlatformAuthRequestDTO
} from '@/streaming-platforms';
import { EventSendAnnouncementDTO } from './dto/event-send-announcement.dto';
import { EventStatus, EventsVotingStatus } from '../domain/events.enums';
import { UsersService } from '@/users';
import { EventDTO } from './dto/event.dto';
import { EventCreateDTO } from './dto/event-create.dto';
import { EventsRepository } from '../infrastructure/persistence/mongo/repositories/events.repository';
import { EventEntity } from '../domain/entities/event.entity';
import { EventUpdateDTO } from './dto/event-update.dto';
import { EventStartDTO } from './dto/event-start.dto';
import { EventCompleteDTO } from './dto/event-complete.dto';
import { EventAnnouncementResultDTO } from './dto/event-announcement-result.dto';
import { EventsVotingStartDTO } from './dto/events-voting-start.dto';
import {
  EVENT_STATUS_ANNOUNCEMENT_MESSAGES,
  EVENTS_VOTING_ANNOUNCEMENT_MESSAGES
} from './event-announcement-messages.constants';

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

  public async getEventsByOwnerId(ownerId: string): Promise<EventDTO[] | null> {
    const user = await this.usersService.getUserById(ownerId);
    if (!user) {
      this.logger.error(`User with ID ${ownerId} not found`);
      return null;
    }

    const events = await this.eventsRepository.findByOwnerId(ownerId);
    if (!events || events.length === 0) {
      this.logger.error(`Events with owner ID ${ownerId} not found`);
      return null;
    }
    return events.map((event) => event.toDTO());
  }

  public async getEventsByOwnerIdAndGame(
    owner: string,
    game: string
  ): Promise<EventDTO[] | null> {
    const user = await this.usersService.getUserById(owner);
    if (!user) {
      this.logger.error(`User with ID ${owner} not found`);
      return null;
    }

    const events = await this.eventsRepository.findByOwnerIdAndGame(
      owner,
      game
    );
    if (!events || events.length === 0) {
      this.logger.error(
        `Events with owner ID ${owner} and game ${game} not found`
      );
      return null;
    }
    return events.map((event) => event.toDTO());
  }

  public async createEvent(
    owner: string,
    data: EventCreateDTO
  ): Promise<EventDTO | null> {
    this.logger.debug(`Creating event with name: ${data.name}`);
    const user = await this.usersService.getUserById(owner);
    if (!user) {
      this.logger.error(`User with ID ${owner} not found`);
      return null;
    }

    const event = EventEntity.create(
      owner,
      data.name,
      data.game,
      data.quality,
      data.duration
    );
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

  public async startVotingForEvents(
    ownerId: string,
    data: EventsVotingStartDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<EventAnnouncementResultDTO | null> {
    const events = await this.eventsRepository.findByOwnerIdAndGame(
      ownerId,
      data.game
    );
    if (!events || events.length === 0) {
      this.logger.error(
        `Events with owner ID ${ownerId} and game ${data.game} not found`
      );
      return null;
    }

    const message = this.getAnnouncementMessage(
      EVENTS_VOTING_ANNOUNCEMENT_MESSAGES[EventsVotingStatus.STARTED],
      {},
      data.lang
    );
    const result = await this.sendEventAnnouncement(
      {
        message,
        platform: data.platform
      },
      authData
    );
    return result;
  }

  public async startEvent(
    data: EventStartDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<EventAnnouncementResultDTO | null> {
    const exists = await this.eventsRepository.existsById(data.eventId);
    if (!exists) {
      this.logger.error(`Event with ID ${data.eventId} not found`);
      return null;
    }

    await this.eventsRepository.changeEventStatus(
      data.eventId,
      EventStatus.STARTED
    );

    const message = this.getAnnouncementMessage(
      EVENT_STATUS_ANNOUNCEMENT_MESSAGES[EventStatus.STARTED],
      {},
      data.lang
    );
    const result = await this.sendEventAnnouncement(
      { message, platform: data.platform },
      authData
    );
    return result;
  }

  public async completeEvent(
    data: EventCompleteDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<EventAnnouncementResultDTO | null> {
    const event = await this.eventsRepository.findById(data.eventId);
    if (!event) {
      this.logger.error(`Event with ID ${data.eventId} not found`);
      return null;
    }

    await this.eventsRepository.changeEventStatus(
      data.eventId,
      EventStatus.COMPLETED
    );

    const message = this.getAnnouncementMessage(
      EVENT_STATUS_ANNOUNCEMENT_MESSAGES[EventStatus.COMPLETED],
      {},
      data.lang
    );
    const result = await this.sendEventAnnouncement(
      {
        message,
        platform: data.platform
      },
      authData
    );
    return result;
  }

  public async sendEventAnnouncement(
    data: EventSendAnnouncementDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<EventAnnouncementResultDTO | null> {
    try {
      const platform = data.platform as StreamingPlatforms;
      const response = await this.streamingFactory
        .getService(platform)
        .sendChatAnnouncement({ message: data.message }, authData);
      if (!response) {
        this.logger.error(
          `Failed to send event announcement on ${platform} platform`
        );
        return null;
      }
      return { message: data.message };
    } catch (error) {
      this.logger.error(`Failed to send chat announcement ${error}`);
      return null;
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

  private getAnnouncementMessage(
    tKey: string,
    { ...args },
    lang: string = publicRuntimeConfig.i18n.fallbackLanguage
  ): string {
    const translateData = { lang, ...args };
    return this.i18nClient.translate(tKey, translateData);
  }
}
