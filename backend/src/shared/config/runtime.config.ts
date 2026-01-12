export const publicRuntimeConfig = {
  application: {
    version: process.env.NESTJS_APPLICATION_VERSION || '1.0.0',
    port: process.env.NESTJS_APPLICATION_PORT || 3000,
    apiPrefix: process.env.NESTJS_APPLICATION_API_PREFIX || 'api/v1'
  },
  swagger: {
    title: process.env.NESTJS_SWAGGER_TITLE || '',
    description: process.env.NESTJS_SWAGGER_DESCRIPTION || ''
  },
  twitch: {
    clientId: process.env.NESTJS_TWITCH_CLIENT_ID || '',
    clientSecret: process.env.NESTJS_TWITCH_CLIENT_SECRET || '',
    idUrl: process.env.NESTJS_TWITCH_ID_URL || '',
    apiUrl: process.env.NESTJS_TWITCH_API_URL || '',
    redirectUrl: process.env.NESTJS_TWITCH_REDIRECT_URI || '',
    authScopes: process.env.NESTJS_TWITCH_AUTH_SCOPES?.split(',') || [],
    accessTokenName: process.env.NESTJS_TWITCH_ACCESS_TOKEN_NAME || '',
    refreshTokenName: process.env.NESTJS_TWITCH_REFRESH_TOKEN_NAME || '',
    broadcasterIdName: process.env.NESTJS_TWITCH_BROADCASTER_ID_NAME || ''
  },
  clients: {
    frontendUrl: process.env.NESTJS_FRONTEND_URL || ''
  },
  i18n: {
    fallbackLanguage: process.env.NESTJS_I18N_FALLBACK_LANGUAGE || 'en',
    supportedLanguages: process.env.NESTJS_I18N_SUPPORTED_LANGUAGES?.split(
      ','
    ) || ['en']
  },
  mongodb: {
    uri: process.env.NESTJS_MONGODB_URI || ''
  }
};
