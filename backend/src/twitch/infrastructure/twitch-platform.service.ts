import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoggerService } from '@/shared/logger';
import { HttpClient, HttpRequestConfig } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';
import { TwitchAppTokenResponse } from './dto/response/twitch-app-token.response';
import { TwitchUserTokenResponse } from './dto/response/twitch-user-token.response';
import { TwitchUserResponse } from './dto/response/twitch-user.response';
import { TwitchChatAnnouncementRequest } from './dto/request/twitch-chat-announcment.request';
import { TwitchStartPollRequest } from './dto/request/twitch-start-poll.request';
import {
  TwitchPollData,
  TwitchPollResponse
} from './dto/response/twitch-poll.response';
import { TwitchBroadcasterType } from './dto/twitch.enums';

@Injectable()
export class TwitchPlatformService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUrl: string;
  private readonly idUrl: string;
  private readonly apiUrl: string;

  constructor(
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

  public async getAppToken(): Promise<TwitchAppTokenResponse> {
    const tokenUrl = `${this.idUrl}/oauth2/token`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials'
    });
    const config: HttpRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    this.logger.debug('Requesting new app access token via client credentials');
    try {
      const response = await this.httpClient.post<TwitchAppTokenResponse>(
        tokenUrl,
        params.toString(),
        config
      );
      this.logger.debug(`Auth data: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to obtain app token', error);
      throw new Error(`Twitch app authentication failed: ${error}`);
    }
  }

  public getAuthUrl(): string {
    const authUrl = new URL(`${this.idUrl}/oauth2/authorize`);
    const defaultScopes = [
      'channel:manage:broadcast' /* Manage broadcast settings */,
      'channel:manage:polls' /* Manage polls rights */,
      'moderator:manage:announcements' /* Manage announcement rights */
    ];
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: 'code',
      force_verify: 'true',
      scope: defaultScopes.join(' ')
    });

    authUrl.search = params.toString();
    return authUrl.toString();
  }

  public async exchangeCodeToToken(
    code: string
  ): Promise<TwitchUserTokenResponse> {
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
      const response = await this.httpClient.post<TwitchUserTokenResponse>(
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
  ): Promise<TwitchUserTokenResponse> {
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
      const response = await this.httpClient.post<TwitchUserTokenResponse>(
        tokenUrl,
        params.toString(),
        config
      );
      this.logger.debug(
        `Refreshed token data: ${JSON.stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to refresh user token', error);
      throw new Error(`Twitch token refresh failed: ${error}`);
    }
  }

  public async getUser(accessToken: string): Promise<TwitchUserResponse> {
    const userUrl = `${this.apiUrl}/helix/users`;
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': this.clientId
      }
    };

    this.logger.debug('Fetching user data from Twitch API');
    try {
      const response = await this.httpClient.get<TwitchUserResponse>(
        userUrl,
        config
      );
      this.logger.debug(`User data: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user data', error);
      throw new Error(`Twitch get user failed: ${error}`);
    }
  }

  public async getPoll(
    accessToken: string,
    broadcasterId: string,
    pollId: string
  ): Promise<TwitchPollData> {
    const pollUrl = `${this.apiUrl}/helix/polls`;
    const params = {
      broadcaster_id: broadcasterId,
      id: pollId
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': this.clientId
      },
      params
    };

    this.logger.debug('Fetching active poll from Twitch channel');
    try {
      const response = await this.httpClient.get<TwitchPollResponse>(
        pollUrl,
        config
      );
      this.logger.debug(`Poll data: ${JSON.stringify(response.data)}`);
      return response.data.data[0];
    } catch (error) {
      this.logger.error('Failed to get active poll', error);
      throw new Error(`Twitch get poll failed: ${error}`);
    }
  }

  public async startPoll(
    accessToken: string,
    data: TwitchStartPollRequest
  ): Promise<TwitchPollData> {
    if (data.broadcasterType === TwitchBroadcasterType.NONE) {
      this.logger.error(
        'Broadcaster is not affiliate or partner, cannot start poll'
      );
      throw new ForbiddenException(
        'Twitch broadcaster must be an affiliate or partner to start polls'
      );
    }

    const pollUrl = `${this.apiUrl}/helix/polls`;
    const body = {
      broadcaster_id: data.broadcasterId,
      title: data.title,
      choices: data.choices,
      duration: data.duration,
      channel_points_voting_enabled: data.channelPointsVotingEnabled,
      channel_points_per_vote: data.channelPointsPerVote
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': this.clientId,
        'Content-Type': 'application/json'
      }
    };

    this.logger.debug('Starting poll on Twitch channel');
    try {
      const response = await this.httpClient.post<TwitchPollResponse>(
        pollUrl,
        body,
        config
      );
      this.logger.debug('Poll started successfully');
      return response.data.data[0];
    } catch (error) {
      this.logger.error('Failed to start poll', error);
      throw new Error(`Twitch start poll failed: ${error}`);
    }
  }

  public async sendChatAnnouncement(
    accessToken: string,
    data: TwitchChatAnnouncementRequest
  ): Promise<void> {
    const chatAnnouncementUrl = `${this.apiUrl}/helix/chat/announcements`;
    const params = {
      broadcaster_id: data.broadcasterId,
      moderator_id: data.broadcasterId
    };
    const body = {
      message: data.message,
      color: data.color
    };
    const config: HttpRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': this.clientId,
        'Content-Type': 'application/json'
      },
      params
    };

    this.logger.debug('Sending chat announcement to Twitch channel');
    try {
      await this.httpClient.post<void>(chatAnnouncementUrl, body, config);
      this.logger.debug('Chat announcement sent successfully');
    } catch (error) {
      this.logger.error('Failed to send chat announcement', error);
      throw new Error(`Twitch send chat announcement failed: ${error}`);
    }
  }
}
