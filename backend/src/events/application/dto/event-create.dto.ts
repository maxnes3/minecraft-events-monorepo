import { ApiProperty } from '@nestjs/swagger';
import { EventQuality } from '@app/events/domain/events.enums';

export class EventCreateDTO {
  @ApiProperty({
    description: 'Name of the event',
    type: String,
    required: true,
    example: 'example-event-name'
  })
  name: string;

  @ApiProperty({
    description: 'Game of the event',
    type: String,
    required: true,
    default: 'minecraft'
  })
  game: string;

  @ApiProperty({
    description: 'Quality of the event',
    enum: EventQuality,
    required: true,
    default: EventQuality.REGULAR
  })
  quality: EventQuality;

  @ApiProperty({
    description: 'Duration of the event in minutes',
    type: Number,
    required: true
  })
  duration: number;
}
