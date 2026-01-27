import { ApiProperty } from '@nestjs/swagger';

export class EventStartDTO {
  @ApiProperty({
    description: '',
    type: String,
    required: true,
    default: 'twitch'
  })
  platform: string;
}
