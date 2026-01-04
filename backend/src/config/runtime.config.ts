export const publicRuntimeConfig = {
  application: {
    version: process.env.NESTJS_APPLICATION_VERSION || '1.0.0',
    port: process.env.NESTJS_APPLICATION_PORT || 4000,
    apiPrefix: process.env.NESTJS_APPLICATION_API_PREFIX || 'api/v1'
  },
  swagger: {
    title: process.env.NESTJS_SWAGGER_TITLE || '',
    description: process.env.NESTJS_SWAGGER_DESCRIPTION || ''
  }
};
