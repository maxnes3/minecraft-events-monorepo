export const publicRuntimeConfig = Object.freeze({
  application: {
    env: process.env.NESTJS_APPLICATION_ENV || '',
    version: process.env.NESTJS_APPLICATION_VERSION || '1.0.0',
    port: Number(process.env.NESTJS_APPLICATION_PORT) || 3000,
    apiPrefix: process.env.NESTJS_APPLICATION_API_PREFIX || 'api/v1',
    name: process.env.NESTJS_APPLICATION_NAME || 'Streaming Events App'
  },
  crypto: {
    tokenEncryption: process.env.NESTJS_CRYPTO_TOKEN_ENCRYPTION_KEY || ''
  },
  jwt: {
    secret: process.env.NESTJS_JWT_SECRET || '',
    expiresIn: Number(process.env.NESTJS_JWT_EXPIRES_IN) || 3600,
    refreshSecret: process.env.NESTJS_JWT_REFRESH_SECRET || '',
    refreshExpiresIn:
      Number(process.env.NESTJS_JWT_REFRESH_EXPIRES_IN) || 604800,
    authorizationHeader: process.env.NESTJS_AUTHORIZATION_HEADER || '',
    refreshTokenHeader: process.env.NESTJS_REFRESH_TOKEN_HEADER || '',
    accessTokenCookieName: process.env.NESTJS_ACCESS_TOKEN_COOKIE_NAME || '',
    refreshTokenCookieName: process.env.NESTJS_REFRESH_TOKEN_COOKIE_NAME || ''
  },
  client: {
    authUserRedirectUrl: process.env.NESTJS_CLIENT_AUTH_USER_REDIRECT_URL || '',
    errorRedirectUrl: process.env.NESTJS_CLIENT_ERROR_REDIRECT_URL || ''
  },
  swagger: {
    enabled: process.env.NESTJS_SWAGGER_ENABLED === 'true' || false,
    title: process.env.NESTJS_SWAGGER_TITLE || '',
    description: process.env.NESTJS_SWAGGER_DESCRIPTION || ''
  },
  i18n: {
    fallbackLanguage: process.env.NESTJS_I18N_FALLBACK_LANGUAGE || 'en',
    supportedLanguages: process.env.NESTJS_I18N_SUPPORTED_LANGUAGES?.split(
      ','
    ) || ['en']
  },
  mongodb: {
    uri: process.env.NESTJS_MONGODB_URI || ''
  },
  twitch: {
    clientId: process.env.NESTJS_TWITCH_CLIENT_ID || '',
    clientSecret: process.env.NESTJS_TWITCH_CLIENT_SECRET || '',
    idUrl: process.env.NESTJS_TWITCH_ID_URL || '',
    apiUrl: process.env.NESTJS_TWITCH_API_URL || '',
    redirectUrl: process.env.NESTJS_TWITCH_REDIRECT_URI || '',
    authScopes: process.env.NESTJS_TWITCH_AUTH_SCOPES?.split(',') || []
  },
  youtube: {
    clientId: process.env.NESTJS_YOUTUBE_CLIENT_ID || '',
    clientSecret: process.env.NESTJS_YOUTUBE_CLIENT_SECRET || '',
    accountsUrl: process.env.NESTJS_YOUTUBE_ACCOUNTS_URL || '',
    oauth2Url: process.env.NESTJS_YOUTUBE_OAUTH2_URL || '',
    apiUrl: process.env.NESTJS_YOUTUBE_API_URL || '',
    redirectUrl: process.env.NESTJS_YOUTUBE_REDIRECT_URI || '',
    authScopes: process.env.NESTJS_YOUTUBE_AUTH_SCOPES?.split(',') || []
  }
});
