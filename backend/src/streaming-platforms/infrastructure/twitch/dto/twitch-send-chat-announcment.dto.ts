import { ApiProperty } from '@nestjs/swagger';
import { TwitchAnnouncementColor } from './twitch.enums';
import { IStreamingPlatformSendChatAnnouncementDTO } from '@/streaming-platforms/domain/interfaces/streaming-platform-chat-announcement.interface';

export class TwitchSendChatAnnouncementDTO implements IStreamingPlatformSendChatAnnouncementDTO {
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
