import { type EventQuality, type EventStatus } from './event.enums';

export interface EventDTO {
  _id: string;
  name: string;
  game: string;
  quality: EventQuality;
  duration: number;
  status: EventStatus;
  createdAt?: string;
}
