import { ApiProperty } from '@nestjs/swagger';

export class EventCompleteDTO {
  @ApiProperty({
    description: '',
    type: String,
    required: true,
    default: 'twitch'
  })
  platform: string;
}
