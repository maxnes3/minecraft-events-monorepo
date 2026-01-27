import { Injectable } from '@nestjs/common';
import { IStreamingPlatformMapper } from '@/streaming-platforms/domain/interfaces/streaming-platform-mapper.interface';
import { YoutubeApiUserTokensDTO } from '../dto/youtube-api-user-tokens.dto';
import { YoutubeApiUserDTO } from '../dto/youtube-api-user.dto';
import { StreamingPlatformTokensDTO } from '@/streaming-platforms/domain/dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '@/streaming-platforms/domain/dto/streaming-platform-user.dto';
import { StreamingPlatforms } from '../../streaming-platforms.enums';

@Injectable()
export class YoutubeMapper implements IStreamingPlatformMapper {
  toStreamingPlatformTokensDTO(
    data: YoutubeApiUserTokensDTO
  ): StreamingPlatformTokensDTO {
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      obtainedAt: new Date().toISOString()
    };
  }
  toStreamingPlatformUserDTO(
    data: YoutubeApiUserDTO
  ): StreamingPlaftormUserDTO {
    return {
      platformName: StreamingPlatforms.YOUTUBE,
      platformId: data.id,
      platformLogin: data.snippet.title
    };
  }
}
