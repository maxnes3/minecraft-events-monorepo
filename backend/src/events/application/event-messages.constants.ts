import { EventStatus, EventsVotingStatus } from '../domain/events.enums';

export const EVENT_STATUS_MESSAGES: Record<EventStatus, string> = {
  [EventStatus.READY]: '',
  [EventStatus.STARTED]: 'messages.events.started',
  [EventStatus.COMPLETED]: 'messages.events.completed'
};

export const EVENTS_VOTING_MESSAGES: Record<EventsVotingStatus, string> = {
  [EventsVotingStatus.STARTED]: 'messages.voting.started',
  [EventsVotingStatus.COMPLETED]: 'messages.voting.completed'
};
