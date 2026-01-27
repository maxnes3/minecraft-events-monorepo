import { ApiProperty } from '@nestjs/swagger';
import { IChatAnnouncementDTO } from '@/streaming-platforms/domain/interfaces/streaming-platform-chat-announcement.interface';

export class YoutubeChatAnnouncementDTO implements IChatAnnouncementDTO {
  @ApiProperty({
    description: 'Announcement message content',
    required: true,
    type: String,
    example: 'This is an important announcement!'
  })
  message: string;
}
