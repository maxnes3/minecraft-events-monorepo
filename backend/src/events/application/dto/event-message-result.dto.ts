import { ApiProperty } from '@nestjs/swagger';

export class EventMessageResultDTO {
  @ApiProperty({
    description: 'Announcement message',
    type: String,
    required: true
  })
  message: string;
}
