import { AuthTokenPayloadDTO } from '../dto/auth-token-payload.dto';

export interface AuthExtendedRequest extends Request {
  user?: AuthTokenPayloadDTO;
}
