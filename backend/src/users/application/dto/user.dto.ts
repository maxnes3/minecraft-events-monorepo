import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ description: '', type: String, required: true })
  _id: string;

  @ApiProperty({ description: '', type: String, required: true })
  name: string;

  @ApiProperty({ description: '', type: String, required: false })
  twitchId?: string;

  @ApiProperty({ description: '', type: String, required: true })
  createdAt: string;

  @ApiProperty({ description: '', type: String, required: true })
  updatedAt: string;
}
