import { ApiProperty } from '@nestjs/swagger';
import { TwitchAnnouncementColor } from '../twitch.enums';
import { IChatAnnouncementDTO } from '@/streaming-platforms/domain/dto/chat-announcement.interface';

export class TwitchChatAnnouncementDTO implements IChatAnnouncementDTO {
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
  color?: TwitchAnnouncementColor = TwitchAnnouncementColor.PRIMARY;
}
