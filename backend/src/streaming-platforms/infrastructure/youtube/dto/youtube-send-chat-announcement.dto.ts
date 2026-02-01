import { ApiProperty } from '@nestjs/swagger';
import { IStreamingPlatformSendChatAnnouncementDTO } from '@/streaming-platforms/domain/interfaces/streaming-platform-chat-announcement.interface';

export class YoutubeSendChatAnnouncementDTO implements IStreamingPlatformSendChatAnnouncementDTO {
  @ApiProperty({
    description: 'Announcement message content',
    required: true,
    type: String,
    example: 'This is an important announcement!'
  })
  message: string;
}
