import { IStreamingPlatformTokensDTO } from '@/streaming-platforms/domain/dto/streaming-platform-tokens.interface';
import { ApiProperty } from '@nestjs/swagger';

export class TwitchTokensDTO implements IStreamingPlatformTokensDTO {
  @ApiProperty({ description: '', type: String, required: true })
  accessToken: string;

  @ApiProperty({ description: '', type: String, required: true })
  refreshToken: string;

  @ApiProperty({ description: '', type: Number, required: true })
  expiresIn: number;
}
