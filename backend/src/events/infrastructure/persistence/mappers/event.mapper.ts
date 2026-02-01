import { Injectable } from '@nestjs/common';
import { EventDocument } from '../mongo/schemas/event.schema';
import { EventEntity } from '@/events/domain/entities/event.entity';

@Injectable()
export class EventMapper {
  public toDomain(document: EventDocument | null): EventEntity | null {
    if (!document) return null;

    return EventEntity.restore(
      document._id.toString(),
      document.owner,
      document.name,
      document.game,
      document.quality,
      document.duration,
      document.status,
      document.createdAt,
      document.updatedAt
    );
  }

  public toPersistence(event: EventEntity): Record<string, any> {
    return {
      _id: event.getId(),
      owner: event.getOwner(),
      name: event.getName(),
      game: event.getGame(),
      quality: event.getQuality(),
      duration: event.getDuration(),
      createdAt: event.getCreatedAt(),
      updatedAt: event.getUpdatedAt()
    };
  }
}
