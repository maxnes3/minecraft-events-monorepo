import { Injectable } from '@nestjs/common';
import { AuthService } from '@/auth';
import { UsersService } from '@/users';
import { LoggerService } from '@/shared/logger';
import { publicRuntimeConfig } from '@/shared/config';
import { YoutubeApiUserTokensDTO } from './dto/youtube-api-user-tokens.dto';
import { HttpClient, HttpRequestConfig } from '@/shared/http';
import { YoutubeMapper } from './mappers/youtube.mappers';
import { YoutubeApiUserResponse } from './dto/youtube-api-user.dto';
import { YoutubeSendChatAnnouncementDTO } from './dto/youtube-send-chat-announcement.dto';
import { StreamingPlatformTokensDTO } from '@/streaming-platforms/domain/dto/streaming-platform-tokens.dto';
import { StreamingPlaftormUserDTO } from '@/streaming-platforms/domain/dto/streaming-platform-user.dto';
import { IStreamingPlatformService } from '@/streaming-platforms/domain/interfaces/streaming-platform-service.interface';
import { YoutubeApiStreamResponse } from './dto/youtube-api-stream.dto';
import { StreamingPlatformAuthDTO } from '@/streaming-platforms/domain/dto/streaming-platform-auth.dto';
import { StreamingPlatformAuthRequestDTO } from '@/streaming-platforms/domain/dto/streaming-platform-auth-request.dto';
import { StreamingPlaftormStreamDTO } from '@/streaming-platforms/domain/dto/streaming-platform-stream.dto';

@Injectable()
export class YoutubePlatformService implements IStreamingPlatformService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUrl: string;
  private readonly accountsUrl: string;
  private readonly oauth2Url: string;
  private readonly apiUrl: string;

  constructor(
    private readonly youtubeMapper: YoutubeMapper,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly httpClient: HttpClient,
    private readonly logger: LoggerService
  ) {
    this.clientId = publicRuntimeConfig.youtube.clientId;
    this.clientSecret = publicRuntimeConfig.youtube.clientSecret;
    this.redirectUrl = publicRuntimeConfig.youtube.redirectUrl;
    this.accountsUrl = publicRuntimeConfig.youtube.accountsUrl;
    this.oauth2Url = publicRuntimeConfig.youtube.oauth2Url;
    this.apiUrl = publicRuntimeConfig.youtube.apiUrl;

    this.logger.setContext(YoutubePlatformService.name);
  }

  public getAuthUrl(isClient?: boolean): string {
    const authUrl = new URL(`${this.accountsUrl}/o/oauth2/v2/auth`);
    const redirectUri = isClient
      ? publicRuntimeConfig.client.url
      : this.redirectUrl;
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: publicRuntimeConfig.youtube.authScopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: ''
    });

    authUrl.search = params.toString();
    return authUrl.toString();
  }

  public async exchangeCodeToToken(
    code: string
  ): Promise<StreamingPlatformTokensDTO> {
    const tokenUrl = `${this.oauth2Url}/token`;
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
      const response = await this.httpClient.post<YoutubeApiUserTokensDTO>(
        tokenUrl,
        params.toString(),
        config
      );
      return this.youtubeMapper.toStreamingPlatformTokensDTO(response.data);
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error);
      throw new Error(`YouTube user authentication failed: ${error}`);
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
    const tokenUrl = `${this.oauth2Url}/token`;
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

    this.logger.debug('Refreshing YouTube user token');
    try {
      const response = await this.httpClient.post<YoutubeApiUserTokensDTO>(
        tokenUrl,
        params.toString(),
        config
      );
      return this.youtubeMapper.toStreamingPlatformTokensDTO(response.data);
    } catch (error) {
      this.logger.error('Failed to refresh user token', error);
      throw new Error(`YouTube token refresh failed: ${error}`);
    }
  }

  public async getUser(
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<StreamingPlaftormUserDTO | null> {
    const userInfoUrl = `${this.apiUrl}/youtube/v3/channels`;
    const params = {
      part: 'snippet',
      mine: true
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        'Content-Type': 'application/json'
      },
      params
    };

    this.logger.debug('Fetching YouTube user information');
    try {
      const response = await this.httpClient.get<YoutubeApiUserResponse>(
        userInfoUrl,
        config
      );
      if (!response.data.items || response.data.items.length === 0) {
        this.logger.error('No user data found in YouTube API response');
        return null;
      }

      return this.youtubeMapper.toStreamingPlatformUserDTO(
        response.data.items[0]
      );
    } catch (error) {
      this.logger.error('Failed to fetch YouTube user information', error);
      throw new Error(`Failed to get YouTube user: ${error}`);
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
      this.logger.error('Failed to authenticate user with YouTube platform');
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
    const streamInLiveUrl = `${this.apiUrl}/youtube/v3/liveBroadcasts`;
    const params = {
      part: 'snippet',
      mine: true
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        'Content-Type': 'application/json'
      },
      params
    };

    this.logger.debug('Fetching YouTube stream in live information');
    try {
      const response = await this.httpClient.get<YoutubeApiStreamResponse>(
        streamInLiveUrl,
        config
      );
      if (!response.data.items || response.data.items.length === 0) {
        this.logger.error('No streams data found in YouTube API response');
        return null;
      }

      return this.youtubeMapper.toStreamingPlatformStreamDTO(
        response.data.items[0]
      );
    } catch (error) {
      this.logger.error('Failed to fetch YouTube streams information', error);
      throw new Error(`Failed to get YouTube streams: ${error}`);
    }
  }

  public async sendChatAnnouncement(
    data: YoutubeSendChatAnnouncementDTO,
    authData: StreamingPlatformAuthRequestDTO
  ): Promise<boolean> {
    if (
      !authData.platformProperties ||
      !authData.platformProperties['liveChatId']
    ) {
      return false;
    }

    const chatAnnouncementUrl = `${this.apiUrl}/youtube/v3/liveChat/messages`;
    const params = {
      part: 'snippet'
    };
    const body = {
      snippet: {
        liveChatId: authData.platformProperties['liveChatId'],
        type: 'textMessageEvent',
        textMessageDetails: {
          messageText: data.message
        }
      }
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        'Content-Type': 'application/json'
      },
      params
    };

    this.logger.debug('Sending chat announcement to Youtube channel');
    try {
      await this.httpClient.post<void>(chatAnnouncementUrl, body, config);
      this.logger.debug('Chat announcement sent successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to send chat announcement', error);
      throw new Error(`Youtube send chat announcement failed: ${error}`);
    }
  }
}
