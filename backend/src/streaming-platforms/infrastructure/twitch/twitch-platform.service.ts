import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/shared/logger';
import { HttpClient, HttpRequestConfig } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';
import { TwitchApiUserTokensDTO } from './dto/twitch-api-user-token.dto';
import { TwitchApiUserResponse } from './dto/twitch-api-user.dto';
import { TwitchChatAnnouncementDTO } from './dto/twitch-chat-announcment.request';
import { TwitchAuthDTO } from './dto/twitch-auth.dto';
import { IStreamingPlatformService } from '../../domain/streaming-platform-service.interface';
import { TwitchTokensDTO } from './dto/twitch-tokens.dto';
import { TwitchMapper } from './mappers/twitch.mappers';
import { TwitchUserDTO } from './dto/twitch-user.dto';

@Injectable()
export class TwitchPlatformService implements IStreamingPlatformService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUrl: string;
  private readonly idUrl: string;
  private readonly apiUrl: string;

  constructor(
    private readonly twitchMapper: TwitchMapper,
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
  ): Promise<TwitchApiUserTokensDTO> {
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
      this.logger.debug(`User token data: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error);
      throw new Error(`Twitch user authentication failed: ${error}`);
    }
  }

  public async refreshUserToken(
    refreshToken: string
  ): Promise<TwitchTokensDTO> {
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
      this.logger.debug(
        `Refreshed token data: ${JSON.stringify(response.data)}`
      );
      return this.twitchMapper.toStreamingPlatformTokensDTO(response.data);
    } catch (error) {
      this.logger.error('Failed to refresh user token', error);
      throw new Error(`Twitch token refresh failed: ${error}`);
    }
  }

  public async getUser(authData: TwitchAuthDTO): Promise<TwitchUserDTO> {
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
      this.logger.debug(`User data: ${JSON.stringify(response.data)}`);
      return this.twitchMapper.toStreamingPlatformUserDTO(
        response.data.data[0]
      );
    } catch (error) {
      this.logger.error('Failed to get user data', error);
      throw new Error(`Twitch get user failed: ${error}`);
    }
  }

  public async sendChatAnnouncement(
    data: TwitchChatAnnouncementDTO,
    authData: TwitchAuthDTO
  ): Promise<boolean> {
    if (!authData.broadcasterId) {
      return false;
    }

    const chatAnnouncementUrl = `${this.apiUrl}/helix/chat/announcements`;
    const params = {
      broadcaster_id: authData.broadcasterId,
      moderator_id: authData.broadcasterId
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
