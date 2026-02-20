import { ApiProperty } from '@nestjs/swagger';
import { UserPlatformDTO } from './user-platform.dto';

export class UserDTO {
  @ApiProperty({
    description: 'Unique identifier of the user',
    type: String,
    required: true
  })
  _id: string;

  @ApiProperty({
    description: 'Platforms of the user',
    type: Array,
    required: true
  })
  platforms: UserPlatformDTO[];

  @ApiProperty({
    description: 'Token for connection to game',
    type: String,
    required: true
  })
  gameConnectToken: string;

  @ApiProperty({
    description: 'Language of the user',
    type: String,
    required: true
  })
  lang: string;

  @ApiProperty({
    description: 'Creation date of the user',
    type: String,
    required: true
  })
  createdAt: string;

  @ApiProperty({
    description: 'Update date of the user',
    type: String,
    required: true
  })
  updatedAt: string;
}
