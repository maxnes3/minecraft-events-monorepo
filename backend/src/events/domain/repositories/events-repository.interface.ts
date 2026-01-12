import { EventEntity } from '../entities/event.entity';

export interface IEventsRepository {
  findById(id: string): Promise<EventEntity | null>;
  findByUserId(userId: string): Promise<EventEntity[]>;

  save(user: EventEntity): Promise<void>;
  update(user: EventEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
