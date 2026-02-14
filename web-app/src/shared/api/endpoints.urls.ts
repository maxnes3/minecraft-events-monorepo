export const PlatformAuthRedirectEndpointUrl = (platform: string) => {
  return `/${platform}/auth/redirect`;
};

export const AuthRefreshTokensEndpointUrl = '/auth/refresh-tokens';

export const UserMeEndpointUrl = '/users/me';
