export const publicRuntimeConfig = Object.freeze({
  application: {
    env: process.env.NEXT_PUBLIC_APPLICATION_ENV || '',
    version: process.env.NEXT_PUBLIC_APPLICATION_VERSION || '1.0.0',
    port: process.env.PORT || 8080,
    name: process.env.NEXT_PUBLIC_APPLICATION_NAME || 'Streaming Events App',
    domain: process.env.NEXT_PUBLIC_APPLICATION_DOMAIN || ''
  },
  jwt: {
    accessTokenCookieName:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_NAME || '',
    refreshTokenCookieName:
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || ''
  },
  i18n: {
    fallbackLanguage: process.env.NEXT_PUBLIC_I18N_FALLBACK_LANGUAGE || 'en',
    supportedLanguages: process.env.NEXT_PUBLIC_I18N_SUPPORTED_LANGUAGES?.split(
      ','
    ) || ['en'],
    cookieName: process.env.NEXT_PUBLIC_I18N_COOKIE_NAME || 'i18next',
    defaultNamespace: process.env.NEXT_PUBLIC_I18N_DEFAULT_NS || 'strings'
  },
  static: {
    root: '/',
    icons: '/icons'
  },
  server: {
    url: process.env.NEXT_PUBLIC_SERVER_URL || '',
    apiUrl: process.env.NEXT_PUBLIC_SERVER_API_URL || ''
  },
  platforms: {
    list: process.env.NEXT_PUBLIC_PLATFORMS_LIST?.split(',') || []
  }
});
