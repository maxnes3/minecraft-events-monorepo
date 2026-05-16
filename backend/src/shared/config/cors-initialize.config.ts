import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { publicRuntimeConfig } from './runtime.config';

enum AppEnv {
  LOCAL = 'local'
}

const corsConfig: Record<AppEnv, CorsOptions> = {
  [AppEnv.LOCAL]: {
    origin: true,
    credentials: true
  }
};

export function corsInitializeConfig(app: INestApplication) {
  const env = publicRuntimeConfig.application.env as AppEnv;
  const corsOptions = corsConfig[env] ?? corsConfig[AppEnv.LOCAL];
  app.enableCors(corsOptions);
}
