import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/shared/logger';
import { HttpClient, HttpRequestConfig } from '@/shared/http';
import { publicRuntimeConfig } from '@/shared/config';
import { TwitchAppTokenResponse } from './dto/twitch-app-token.response';
import { TwitchUserTokenResponse } from './dto/twitch-user-token.response';
import { TwitchUserResponse } from './dto/twitch-user.response';

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

    this.httpClient.setDefaultHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.logger.setContext(TwitchPlatformService.name);
  }

  public async getAppToken(): Promise<TwitchAppTokenResponse> {
    const tokenUrl = `${this.idUrl}/oauth2/token`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials'
    });

    this.logger.debug('Requesting new app access token via client credentials');
    try {
      const response = await this.httpClient.post<TwitchAppTokenResponse>(
        tokenUrl,
        params.toString()
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
      'chat:read',
      'chat:edit',
      'channel:read:redemptions',
      'channel:manage:redemptions'
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

    this.logger.debug('Exchanging authorization code for user token');
    try {
      const response = await this.httpClient.post<TwitchUserTokenResponse>(
        tokenUrl,
        params.toString()
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

    this.logger.debug('Refreshing Twitch user token');
    try {
      const response = await this.httpClient.post<TwitchUserTokenResponse>(
        tokenUrl,
        params.toString()
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
}
