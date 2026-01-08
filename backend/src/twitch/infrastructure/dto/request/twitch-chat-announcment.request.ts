import { ApiProperty } from '@nestjs/swagger';
import { TwitchAnnouncementColor } from '../twitch.enums';

export class TwitchChatAnnouncementRequest {
  @ApiProperty({
    description: 'Broadcaster ID where the announcement will be sent',
    required: true,
    type: String
  })
  broadcasterId: string;

  @ApiProperty({
    description: 'Announcement message content',
    required: true,
    type: String,
    example: 'This is an important announcement!'
  })
  message: string;

  @ApiProperty({
    description: 'Color of the announcement banner',
    required: false,
    enum: TwitchAnnouncementColor,
    default: TwitchAnnouncementColor.PRIMARY
  })
  color: TwitchAnnouncementColor;
}
