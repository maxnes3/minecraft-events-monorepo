import { Injectable } from '@nestjs/common';
import { TwitchTokensDTO } from '../dto/twitch-tokens.dto';
import { TwitchApiUserTokensDTO } from '../dto/twitch-api-user-token.dto';
import { IStreamingPlatformMapper } from '@/streaming-platforms/domain/streaming-platform-mapper.interface';
import { TwitchApiUserDTO } from '../dto/twitch-api-user.dto';
import { TwitchUserDTO } from '../dto/twitch-user.dto';

@Injectable()
export class TwitchMapper implements IStreamingPlatformMapper {
  public toStreamingPlatformTokensDTO(
    data: TwitchApiUserTokensDTO
  ): TwitchTokensDTO {
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    };
  }

  public toStreamingPlatformUserDTO(data: TwitchApiUserDTO): TwitchUserDTO {
    return {
      login: data.login,
      platformId: data.id,
      platformProfileImgUrl: data.profile_image_url
    };
  }
}
