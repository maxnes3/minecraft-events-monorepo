import { publicRuntimeConfig } from '@/shared/config';

export class AuthTokensFromHeadersDTO {
  constructor(
    public readonly accessToken?: string,
    public readonly refreshToken?: string
  ) {}

  public static fromHeaders(
    headers: Record<string, string>
  ): AuthTokensFromHeadersDTO {
    const authorization =
      headers[publicRuntimeConfig.jwt.authorizationHeader] ||
      headers.authorization;
    const refreshToken = headers[publicRuntimeConfig.jwt.refreshTokenHeader];

    let accessToken: string | undefined;

    if (authorization && authorization.startsWith('Bearer ')) {
      accessToken = authorization.substring(7);
    }

    return new AuthTokensFromHeadersDTO(accessToken, refreshToken);
  }
}
