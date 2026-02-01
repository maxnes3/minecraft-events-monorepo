import { EventStatus, EventsVotingStatus } from '../domain/events.enums';

export const EVENT_STATUS_ANNOUNCEMENT_MESSAGES: Record<EventStatus, string> = {
  [EventStatus.READY]: '',
  [EventStatus.STARTED]: 'announcements.events.started',
  [EventStatus.COMPLETED]: 'announcements.events.completed'
};

export const EVENTS_VOTING_ANNOUNCEMENT_MESSAGES: Record<
  EventsVotingStatus,
  string
> = {
  [EventsVotingStatus.STARTED]: 'announcements.voting.started',
  [EventsVotingStatus.COMPLETED]: 'announcements.voting.completed'
};
