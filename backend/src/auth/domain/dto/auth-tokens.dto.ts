import { publicRuntimeConfig } from '@app/shared/config';

export class AuthTokensDTO {
  constructor(
    public readonly accessToken?: string,
    public readonly refreshToken?: string
  ) {}

  public static fromCookies(cookies: Record<string, string>): AuthTokensDTO {
    const accessToken = cookies[publicRuntimeConfig.jwt.accessTokenCookieName];
    const refreshToken =
      cookies[publicRuntimeConfig.jwt.refreshTokenCookieName];
    return new AuthTokensDTO(accessToken, refreshToken);
  }

  public static fromHeaders(headers: Record<string, string>): AuthTokensDTO {
    const authorization =
      headers[publicRuntimeConfig.jwt.authorizationHeader] ||
      headers.authorization;
    const refreshToken = headers[publicRuntimeConfig.jwt.refreshTokenHeader];

    let accessToken: string | undefined;

    if (authorization && authorization.startsWith('Bearer ')) {
      accessToken = authorization.substring(7);
    }

    return new AuthTokensDTO(accessToken, refreshToken);
  }
}
