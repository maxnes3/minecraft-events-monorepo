import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDTO {
  @ApiProperty({ description: '', type: String, required: true })
  login: string;
}
