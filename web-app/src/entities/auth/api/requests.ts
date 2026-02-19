import {
  AuthLogoutEndpointUrl,
  AuthRefreshTokensEndpointUrl
} from '@app/shared/api';
import { createHttpRequest, RequestMethod } from '@app/shared/lib/http';
import { type BaseServerResponse } from '@app/shared/model';
import { type AuthRedirectUrlDTO } from '../model';

export const GetAuthRedirectUrlRequest = createHttpRequest<
  BaseServerResponse<AuthRedirectUrlDTO>
>({
  method: RequestMethod.GET
});

export const GetExchangeCodeToTokensRequest =
  createHttpRequest<BaseServerResponse>({
    method: RequestMethod.GET
  });

export const PostRefreshTokensRequest = createHttpRequest<BaseServerResponse>({
  method: RequestMethod.POST,
  url: AuthRefreshTokensEndpointUrl
});

export const PostAuthLogoutRequest = createHttpRequest<BaseServerResponse>({
  method: RequestMethod.POST,
  url: AuthLogoutEndpointUrl
});
