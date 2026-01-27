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
      document.duration,
      document.status,
      document.createdAt,
      document.updatedAt
    );
  }

  public toPersistence(user: EventEntity): Record<string, any> {
    return {
      _id: user.getId(),
      owner: user.getOwner(),
      name: user.getName(),
      duration: user.getDuration(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    };
  }
}
