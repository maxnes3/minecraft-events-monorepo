import { EventStatus } from '@/events/domain/entities/events.enums';
import { ApiProperty } from '@nestjs/swagger';

export class EventDTO {
  @ApiProperty({ description: '', type: String, required: true })
  _id: string;

  @ApiProperty({ description: '', type: String, required: true })
  owner: string;

  @ApiProperty({ description: '', type: String, required: true })
  name: string;

  @ApiProperty({ description: '', type: Number, required: true })
  duration: number;

  @ApiProperty({
    description: '',
    enum: EventStatus,
    required: true,
    default: EventStatus.READY
  })
  status: EventStatus;

  @ApiProperty({ description: '', type: String, required: false })
  createdAt?: string;

  @ApiProperty({ description: '', type: String, required: false })
  updatedAt?: string;
}
