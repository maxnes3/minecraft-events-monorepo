import { ApiProperty } from '@nestjs/swagger';
import { UserPlatformAuthDTO } from './user-platform-auth.dto';

export class UserPlatformDTO {
  @ApiProperty({ type: String, required: true, example: 'twitch' })
  name: string;

  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: String, required: false, example: 'examplelogin' })
  login?: string | undefined;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://example.domain.com/img'
  })
  profileImgUrl?: string | undefined;

  @ApiProperty({
    type: Object,
    required: true
  })
  auth: UserPlatformAuthDTO;
}
