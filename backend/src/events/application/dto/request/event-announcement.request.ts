import { StreamingPlatforms } from '@/streaming-platforms';
import { EventStatus } from '../events.enums';
import { ApiProperty } from '@nestjs/swagger';
import { publicRuntimeConfig } from '@/shared/config';

export class EventAnnouncementDTO {
  @ApiProperty({
    description: '',
    required: true,
    enum: EventStatus,
    default: EventStatus.STARTED
  })
  status: EventStatus;

  @ApiProperty({
    description: '',
    required: true,
    enum: StreamingPlatforms,
    default: StreamingPlatforms.TWITCH
  })
  platform: StreamingPlatforms;

  @ApiProperty({
    description: '',
    required: false,
    type: String,
    default: publicRuntimeConfig.i18n.fallbackLanguage
  })
  lang?: string;
}
