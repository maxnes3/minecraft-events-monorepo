import { ApiProperty } from '@nestjs/swagger';

export class EventsVotingStartDTO {
  @ApiProperty({
    description: 'Game for which voting is started',
    type: String,
    required: true,
    example: 'minecraft'
  })
  game: string;

  @ApiProperty({
    description: 'Platform on which voting is started',
    type: String,
    required: true,
    example: 'twitch'
  })
  platform: string;

  @ApiProperty({
    description: 'Duration of the voting in seconds',
    type: Number,
    required: true,
    example: 180
  })
  duration: number;

  @ApiProperty({
    description: 'Language for announcement',
    type: String,
    required: false,
    example: 'en'
  })
  lang?: string;
}
