import { ApiProperty } from '@nestjs/swagger';

export class EventSendMessageDTO {
  @ApiProperty({
    description: 'Message to be announced',
    required: true,
    type: String,
    example: 'Test announcement message!'
  })
  message: string;

  @ApiProperty({
    description: 'Streaming platform',
    type: String,
    required: true,
    default: 'twitch'
  })
  platform: string;
}
