import { ApiProperty } from '@nestjs/swagger';
import { IStreamingPlatformSendMessageDTO } from '@app/streaming-platforms/domain/interfaces/streaming-platform-send-message.interface';

export class YoutubeSendMessageDTO implements IStreamingPlatformSendMessageDTO {
  @ApiProperty({
    description: 'Announcement message content',
    required: true,
    type: String,
    example: 'This is an important announcement!'
  })
  message: string;
}
