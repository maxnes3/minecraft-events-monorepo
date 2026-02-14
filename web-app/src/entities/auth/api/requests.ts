import { AuthRefreshTokensEndpointUrl } from '@app/shared/api';
import { createHttpRequest, RequestMethod } from '@app/shared/lib/http';
import { type BaseServerResponse } from '@app/shared/model';
import { type AuthRedirectUrlDTO } from '../model';

export const GetAuthRedirectUrlRequest = createHttpRequest<
  BaseServerResponse<AuthRedirectUrlDTO>
>({
  method: RequestMethod.GET
});

export const RefreshTokensRequest = createHttpRequest<BaseServerResponse>({
  method: RequestMethod.POST,
  url: AuthRefreshTokensEndpointUrl
});
