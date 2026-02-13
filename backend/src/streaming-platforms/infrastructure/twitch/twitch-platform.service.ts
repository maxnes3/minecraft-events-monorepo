import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth';
import { UsersService } from '@app/users';
import { LoggerService } from '@app/shared/logger';
import { HttpClient, HttpRequestConfig } from '@app/shared/http';
import { publicRuntimeConfig } from '@app/shared/config';
import { TwitchApiUserTokensDTO } from './dto/twitch-api-user-token.dto';
import { TwitchApiUserResponse } from './dto/twitch-api-user.dto';
import { TwitchSendMessageDTO } from './dto/twitch-send-message.dto';
import { IStreamingPlatformService } from '../../domain/interfaces/streaming-platform-service.interface';
import { TwitchMapper } from './mappers/twitch.mappers';
import { StreamingPlatformTokensDTO } from '@app/streaming-platforms/domain/dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '@app/streaming-platforms/domain/dto/streaming-platform-user.dto';
import { StreamingPlatformAuthDTO } from '@app/streaming-platforms/domain/dto/streaming-platform-auth.dto';
import { StreamingPlatformAuthRequestDTO } from '@app/streaming-platforms/domain/dto/streaming-platform-auth-request.dto';
import { TwitchApiStreamResponse } from './dto/twitch-api-stream.dto';
import { StreamingPlaftormStreamDTO } from '@app/streaming-platforms/domain/dto/streaming-platform-stream.dto';

@Injectable()
export class TwitchPlatformService implements IStreamingPlatformService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUrl: string;
  private readonly idUrl: string;
  private readonly apiUrl: string;

  constructor(
    private readonly twitchMapper: TwitchMapper,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly httpClient: HttpClient,
    private readonly logger: LoggerService
  ) {
    this.clientId = publicRuntimeConfig.twitch.clientId;
    this.clientSecret = publicRuntimeConfig.twitch.clientSecret;
    this.redirectUrl = publicRuntimeConfig.twitch.redirectUrl;
    this.idUrl = publicRuntimeConfig.twitch.idUrl;
    this.apiUrl = publicRuntimeConfig.twitch.apiUrl;

    this.logger.setContext(TwitchPlatformService.name);
  }

  public getAuthUrl(redirectUrl?: string): string {
    const authUrl = new URL(`${this.idUrl}/oauth2/authorize`);
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUrl || this.redirectUrl,
      response_type: 'code',
      force_verify: 'true',
      scope: publicRuntimeConfig.twitch.authScopes.join(' ')
    });

    authUrl.search = params.toString();
    return authUrl.toString();
  }

  public async exchangeCodeToToken(
    code: string
  ): Promise<StreamingPlatformTokensDTO> {
    const tokenUrl = `${this.idUrl}/oauth2/token`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUrl
    });
    const config: HttpRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    this.logger.debug('Exchanging authorization code for user token');
    try {
      const response = await this.httpClient.post<TwitchApiUserTokensDTO>(
        tokenUrl,
        params.toString(),
        config
      );
      return this.twitchMapper.toStreamingPlatformTokensDTO(response.data);
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error);
      throw new Error(`Twitch user authentication failed: ${error}`);
    }
  }

  public isTokenExpired(tokens: StreamingPlatformTokensDTO): boolean {
    if (tokens.expiresIn === 0) {
      this.logger.debug('Token has expiresIn = 0, considered never-expiring');
      return false;
    }

    if (!tokens.accessToken || tokens.accessToken.trim().length === 0) {
      this.logger.warn('Token has empty accessToken, considering expired');
      return true;
    }

    if (!tokens.obtainedAt) {
      this.logger.warn('Token missing obtainedAt, assuming expired');
      return true;
    }

    try {
      const obtainedAt = new Date(tokens.obtainedAt);

      if (isNaN(obtainedAt.getTime())) {
        this.logger.warn('Token has invalid obtainedAt date, assuming expired');
        return true;
      }

      const expirationTime = obtainedAt.getTime() + tokens.expiresIn * 1000;
      const currentTime = Date.now();

      const bufferMs = 30 * 1000;
      const isExpired = currentTime >= expirationTime - bufferMs;

      if (isExpired) {
        this.logger.debug(
          `Token expired. Obtained: ${obtainedAt.toISOString()}, ` +
            `Duration: ${tokens.expiresIn}s, ` +
            `Current: ${new Date().toISOString()}`
        );
      } else {
        const timeLeftSeconds = Math.round(
          (expirationTime - currentTime) / 1000
        );
        const timeLeftMinutes = Math.round((timeLeftSeconds / 60) * 10) / 10;

        this.logger.debug(
          `Token valid for ${timeLeftSeconds}s (${timeLeftMinutes} min)`
        );
      }

      return isExpired;
    } catch (error) {
      this.logger.error(`Error checking token expiration: ${error}`);
      return true;
    }
  }

  public async refreshUserToken(
    refreshToken: string
  ): Promise<StreamingPlatformTokensDTO> {
    const tokenUrl = `${this.idUrl}/oauth2/token`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    const config: HttpRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    this.logger.debug('Refreshing Twitch user token');
    try {
      const response = await this.httpClient.post<TwitchApiUserTokensDTO>(
        tokenUrl,
        params.toString(),
        config
      );
      return this.twitchMapper.toStreamingPlatformTokensDTO(response.data);
    } catch (error) {
      this.logger.error('Failed to refresh user token', error);
      throw new Error(`Twitch token refresh failed: ${error}`);
    }
  }

  public async getUser(
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<StreamingPlaftormUserDTO> {
    const userUrl = `${this.apiUrl}/helix/users`;
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        'Client-Id': this.clientId
      }
    };

    this.logger.debug('Fetching user data from Twitch API');
    try {
      const response = await this.httpClient.get<TwitchApiUserResponse>(
        userUrl,
        config
      );
      return this.twitchMapper.toStreamingPlatformUserDTO(
        response.data.data[0]
      );
    } catch (error) {
      this.logger.error('Failed to get user data', error);
      throw new Error(`Twitch get user failed: ${error}`);
    }
  }

  public async authUserByPlatform(
    tokens: StreamingPlatformTokensDTO,
    data: StreamingPlaftormUserDTO
  ): Promise<StreamingPlatformAuthDTO | null> {
    const user = await this.usersService.upsertUserByPlatformAuth({
      name: data.platformName,
      id: data.platformId,
      login: data.platformLogin,
      profileImgUrl: data.platformProfileImgUrl,
      auth: tokens
    });
    if (!user) {
      this.logger.error('Failed to authenticate user with Twitch platform');
      return null;
    }
    this.logger.debug(`Authenticated user: ${JSON.stringify(user)}`);

    const userTokens = await this.authService.createToken(user._id);
    this.logger.debug(`User tokens: ${JSON.stringify(userTokens)}`);
    return {
      platformName: data.platformName,
      login: data.platformLogin,
      profileImgUrl: data.platformProfileImgUrl,
      auth: userTokens
    };
  }

  public async getStreamInLive(
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<StreamingPlaftormStreamDTO | null> {
    if (!authData.platformId) {
      return null;
    }

    const streamInLiveUrl = `${this.apiUrl}/helix/streams`;
    const params = {
      user_id: authData.platformId,
      type: 'live'
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        'Content-Type': 'application/json'
      },
      params
    };

    this.logger.debug('Fetching Twitch stream in live information');
    try {
      const response = await this.httpClient.get<TwitchApiStreamResponse>(
        streamInLiveUrl,
        config
      );
      if (!response.data || response.data.data.length === 0) {
        this.logger.error('No streams data found in Twitch API response');
        return null;
      }

      return this.twitchMapper.toStreamingPlatformStreamDTO(
        response.data.data[0]
      );
    } catch (error) {
      this.logger.error('Failed to fetch Twitch streams information', error);
      throw new Error(`Failed to get Twitch streams: ${error}`);
    }
  }

  public async sendMessage(
    data: TwitchSendMessageDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<boolean> {
    if (!authData.platformId) {
      this.logger.error(`Not found platformId in AuthData`);
      return false;
    }

    const chatAnnouncementUrl = `${this.apiUrl}/helix/chat/announcements`;
    const params = {
      broadcaster_id: authData.platformId,
      moderator_id: authData.platformId
    };
    const body = {
      message: data.message,
      color: data.color
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        'Client-Id': this.clientId,
        'Content-Type': 'application/json'
      },
      params
    };

    this.logger.debug('Sending chat announcement to Twitch channel');
    try {
      await this.httpClient.post<void>(chatAnnouncementUrl, body, config);
      this.logger.debug('Chat announcement sent successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to send chat announcement', error);
      throw new Error(`Twitch send chat announcement failed: ${error}`);
    }
  }
}
