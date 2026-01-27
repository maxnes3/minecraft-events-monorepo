import { Injectable } from '@nestjs/common';
import { TwitchApiUserTokensDTO } from '../dto/twitch-api-user-token.dto';
import { IStreamingPlatformMapper } from '@/streaming-platforms/domain/interfaces/streaming-platform-mapper.interface';
import { TwitchApiUserDTO } from '../dto/twitch-api-user.dto';
import { StreamingPlaftormUserDTO } from '@/streaming-platforms/domain/dto/streaming-platform-user.dto';
import { StreamingPlatformTokensDTO } from '@/streaming-platforms/domain/dto/streaming-platform-tokens.dto';
import { StreamingPlatforms } from '../../streaming-platforms.enums';

@Injectable()
export class TwitchMapper implements IStreamingPlatformMapper {
  public toStreamingPlatformTokensDTO(
    data: TwitchApiUserTokensDTO
  ): StreamingPlatformTokensDTO {
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      obtainedAt: new Date().toISOString()
    };
  }

  public toStreamingPlatformUserDTO(
    data: TwitchApiUserDTO
  ): StreamingPlaftormUserDTO {
    return {
      platformName: StreamingPlatforms.TWITCH,
      platformLogin: data.login,
      platformId: data.id,
      platformProfileImgUrl: data.profile_image_url
    };
  }
}
