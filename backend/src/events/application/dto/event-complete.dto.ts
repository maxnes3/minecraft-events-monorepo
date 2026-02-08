import { publicRuntimeConfig } from '@app/shared/config';
import { ApiProperty } from '@nestjs/swagger';

export class EventCompleteDTO {
  @ApiProperty({
    description: 'Event Id',
    type: String,
    required: false,
    example: 'example-event-id'
  })
  eventId: string;

  @ApiProperty({
    description: 'Streaming platform',
    type: String,
    required: true,
    default: 'twitch'
  })
  platform: string;

  @ApiProperty({
    description: 'Language for announcement',
    type: String,
    required: false,
    default: publicRuntimeConfig.i18n.fallbackLanguage
  })
  lang?: string;
}
