import { ApiProperty } from '@nestjs/swagger';
import { UserPlatformDTO } from './user-platform.dto';

export class UserDTO {
  @ApiProperty({ description: '', type: String, required: true })
  _id: string;

  @ApiProperty({ description: '', type: Array, required: true })
  platforms: UserPlatformDTO[];

  @ApiProperty({ description: '', type: String, required: true })
  createdAt: string;

  @ApiProperty({ description: '', type: String, required: true })
  updatedAt: string;
}
