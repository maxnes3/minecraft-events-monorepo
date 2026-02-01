import { EventDTO } from '@/events/application/dto/event.dto';
import { Injectable } from '@nestjs/common';
import { EventPresentationDTO } from '../dto/event-presentation.dto';

@Injectable()
export class EventPresentationMapper {
  public toPresentationDTO(dto: EventDTO): EventPresentationDTO {
    return {
      _id: dto._id,
      name: dto.name,
      game: dto.game,
      quality: dto.quality,
      duration: dto.duration,
      status: dto.status,
      createdAt: dto.createdAt
    };
  }
}
