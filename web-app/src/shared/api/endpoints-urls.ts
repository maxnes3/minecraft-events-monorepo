/* Authorization urls */
export const PlatformAuthRedirectEndpointUrl = (platform: string) => {
  return `/${platform}/auth/redirect`;
};

export const PlatformExchangeCodeToTokensUrl = (platform: string) => {
  return `/${platform}/auth/callback`;
};

export const AuthRefreshTokensEndpointUrl = '/auth/refresh-tokens';

export const AuthLogoutEndpointUrl = '/auth/logout';

/* Users urls */
export const UserMeEndpointUrl = '/users/me';

export const UserMeGameConnectTokenEndpointUrl = '/users/me/game-connect-token';
