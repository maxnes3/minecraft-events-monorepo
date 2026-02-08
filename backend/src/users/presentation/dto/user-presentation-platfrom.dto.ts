import { ApiProperty } from '@nestjs/swagger';

export class UserPresentationPlatformDTO {
  @ApiProperty({ type: String, required: true, example: 'twitch' })
  name: string;

  @ApiProperty({ type: String, required: false, example: 'examplelogin' })
  login?: string | undefined;

  @ApiProperty({
    type: String,
    required: false,
    example: 'https://example.domain.com/img'
  })
  profileImgUrl?: string | undefined;
}
