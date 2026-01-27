import { EventStatus } from '../../domain/entities/events.enums';
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
    type: String,
    required: true,
    default: 'twitch'
  })
  platform: string;

  @ApiProperty({
    description: '',
    required: false,
    type: String,
    default: publicRuntimeConfig.i18n.fallbackLanguage
  })
  lang?: string;
}
