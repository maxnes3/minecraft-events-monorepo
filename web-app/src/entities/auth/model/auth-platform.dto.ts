import { type AuthTokensDTO } from './auth-tokens.dto';

export interface AuthPlatformDTO {
  platformName: string;
  login: string;
  profileImgUrl?: string | undefined;
  auth: AuthTokensDTO;
}
