export const PlatformAuthRedirectEndpointUrl = (platform: string) => {
  return `/${platform}/auth/redirect`;
};

export const PlatformAuthCallbackEndpointUrl = (platform: string) => {
  return `/${platform}/auth/callback`;
};

export const AuthRefreshTokensEndpointUrl = '/auth/refresh-tokens';

export const UserMeEndpointUrl = '/users/me';
