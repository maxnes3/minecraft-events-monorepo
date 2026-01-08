import { ApiProperty } from '@nestjs/swagger';
import { TwitchBroadcasterType } from '../twitch.enums';

export class TwitchStartPollRequest {
  @ApiProperty({
    description: 'Broadcaster ID where the poll will be created',
    required: true,
    type: String
  })
  broadcasterId: string;

  @ApiProperty({
    description: 'Type of the broadcaster',
    required: true,
    enum: TwitchBroadcasterType
  })
  broadcasterType: TwitchBroadcasterType;

  @ApiProperty({
    description: 'Title of the poll',
    required: true,
    type: String
  })
  title: string;

  @ApiProperty({
    description: 'List of choices for the poll',
    required: true,
    type: [Object],
    example: [{ title: 'Choice 1' }, { title: 'Choice 2' }]
  })
  choices: { title: string }[];

  @ApiProperty({
    description: 'Duration of the poll in seconds',
    required: true,
    type: Number,
    example: 1800
  })
  duration: number;

  @ApiProperty({
    description: 'Enable channel points voting for the poll',
    required: false,
    type: Boolean,
    default: false
  })
  channelPointsVotingEnabled?: boolean;

  @ApiProperty({
    description:
      'Number of channel points required per vote (required if channel points voting is enabled)',
    required: false,
    type: Number
  })
  channelPointsPerVote?: number;
}
