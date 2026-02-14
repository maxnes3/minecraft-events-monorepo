export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  obtainedAt: string;
}
