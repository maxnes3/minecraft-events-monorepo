import { ApiProperty } from '@nestjs/swagger';

export class EventAnnouncementResultDTO {
  @ApiProperty({
    description: 'Announcement message',
    type: String,
    required: true
  })
  message: string;
}
