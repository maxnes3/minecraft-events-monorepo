import { EventEntity } from '../entities/event.entity';

export interface IEventsRepository {
  findById(id: string): Promise<EventEntity | null>;
  findByOwnerId(ownerId: string): Promise<EventEntity[]>;
  findByOwnerIdAndGame(ownerId: string, game: string): Promise<EventEntity[]>;

  save(user: EventEntity): Promise<void>;
  update(user: EventEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
