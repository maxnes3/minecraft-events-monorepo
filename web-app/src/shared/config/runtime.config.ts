export const publicRuntimeConfig = {
  application: {
    env: process.env.NEXT_PUBLIC_APPLICATION_ENV || '',
    version: process.env.NEXT_PUBLIC_APPLICATION_VERSION || '1.0.0',
    port: process.env.PORT || 8080,
    name: process.env.NEXT_PUBLIC_APPLICATION_NAME || 'Streaming Events App'
  }
};
