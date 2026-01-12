import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDTO {
  @ApiProperty({ description: '', type: String, required: true })
  name: string;

  @ApiProperty({ description: '', type: String, required: false })
  twitchId?: string;
}
