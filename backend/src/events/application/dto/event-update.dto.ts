import { ApiProperty } from '@nestjs/swagger';

export class EventUpdateDTO {
  @ApiProperty({ description: '', type: String, required: false })
  name: string;

  @ApiProperty({ description: '', type: Number, required: false })
  duration: number;
}
