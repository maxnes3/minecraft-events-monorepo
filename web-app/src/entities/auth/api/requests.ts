import { AuthRefreshTokensEndpointUrl } from '@app/shared/api';
import { createHttpRequest, RequestMethod } from '@app/shared/lib/http';
import { type BaseServerResponse } from '@app/shared/model';
import {
  type AuthPlatformDTO,
  type AuthRedirectUrlDTO,
  type AuthTokensDTO
} from '../model';

export const GetAuthRedirectUrlRequest = createHttpRequest<
  BaseServerResponse<AuthRedirectUrlDTO>
>({
  method: RequestMethod.GET
});

export const ExchangeAuthCodeRequest = createHttpRequest<
  BaseServerResponse<AuthPlatformDTO>
>({
  method: RequestMethod.GET
});

export const RefreshTokensRequest = createHttpRequest<
  BaseServerResponse<AuthTokensDTO>
>({
  method: RequestMethod.POST,
  url: AuthRefreshTokensEndpointUrl,
  options: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});
