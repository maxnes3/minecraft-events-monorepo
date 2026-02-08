import { ApiProperty } from '@nestjs/swagger';
import { TwitchAnnouncementColor } from './twitch.enums';
import { IStreamingPlatformSendMessageDTO } from '@app/streaming-platforms/domain/interfaces/streaming-platform-send-message.interface';

export class TwitchSendMessageDTO implements IStreamingPlatformSendMessageDTO {
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
