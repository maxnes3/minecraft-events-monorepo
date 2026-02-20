import {
  UserMeEndpointUrl,
  UserMeGameConnectTokenEndpointUrl
} from '@app/shared/api';
import { createHttpRequest, RequestMethod } from '@app/shared/lib/http';
import { type BaseServerResponse } from '@app/shared/model';
import { type UserDTO, type UserGameConnectDTO } from '../model';

export const GetUserMeRequest = createHttpRequest<BaseServerResponse<UserDTO>>({
  method: RequestMethod.GET,
  url: UserMeEndpointUrl
});

export const GetUserMeGameConnectTokenRequest = createHttpRequest<
  BaseServerResponse<UserGameConnectDTO>
>({
  method: RequestMethod.GET,
  url: UserMeGameConnectTokenEndpointUrl
});
