import { ApiProperty } from '@nestjs/swagger';

export class UserRemovePlatformDTO {
  @ApiProperty({ type: String, required: true, example: 'twitch' })
  platformName: string;
}
