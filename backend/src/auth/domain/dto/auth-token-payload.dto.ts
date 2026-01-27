export class AuthTokenPayloadDTO {
  sub: string;
  type?: string;
  iat?: number;
  exp?: number;
}
