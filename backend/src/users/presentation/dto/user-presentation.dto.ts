import { ApiProperty } from '@nestjs/swagger';
import { UserPresentationPlatformDTO } from './user-presentation-platfrom.dto';

export class UserPresentationDTO {
  @ApiProperty({
    description: 'Platforms of the user',
    type: Array,
    required: true
  })
  platforms: UserPresentationPlatformDTO[];

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
}
