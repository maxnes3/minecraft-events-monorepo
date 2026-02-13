import { createHttpRequest, RequestMethod } from '@app/shared/lib/http';
import { type BaseServerResponse } from '@app/shared/model';
import { UserMeEndpointUrl } from '@app/shared/api';
import { type UserDTO } from '../model';

export const GetUserMeRequest = createHttpRequest<BaseServerResponse<UserDTO>>({
  method: RequestMethod.GET,
  url: UserMeEndpointUrl
});
