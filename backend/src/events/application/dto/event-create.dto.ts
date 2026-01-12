import { ApiProperty } from '@nestjs/swagger';

export class EventCreateDTO {
  @ApiProperty({ description: '', type: String, required: true })
  owner: string;

  @ApiProperty({ description: '', type: String, required: true })
  name: string;

  @ApiProperty({ description: '', type: Number, required: true })
  duration: number;
}
