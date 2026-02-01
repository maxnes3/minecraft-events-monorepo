import { EventQuality, EventStatus } from '@/events/domain/events.enums';
import { ApiProperty } from '@nestjs/swagger';

export class EventDTO {
  @ApiProperty({
    description: 'Unique identifier of the event',
    type: String,
    required: true
  })
  _id: string;

  @ApiProperty({
    description: 'Owner of the event',
    type: String,
    required: true
  })
  owner: string;

  @ApiProperty({
    description: 'Name of the event',
    type: String,
    required: true
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

  @ApiProperty({
    description: 'Status of the event',
    enum: EventStatus,
    required: true,
    default: EventStatus.READY
  })
  status: EventStatus;

  @ApiProperty({
    description: 'Creation date of the event',
    type: String,
    required: false
  })
  createdAt?: string;

  @ApiProperty({
    description: 'Update date of the event',
    type: String,
    required: false
  })
  updatedAt?: string;
}
