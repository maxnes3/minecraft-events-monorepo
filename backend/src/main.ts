import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';
import {
  publicRuntimeConfig,
  initSwaggerConfig,
  corsInitializeConfig
} from './shared/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Api Prefix */
  app.setGlobalPrefix(publicRuntimeConfig.application.apiPrefix);

  /* Swagger */
  initSwaggerConfig(app);

  /* CORS */
  corsInitializeConfig(app);

  /* Cookies */
  app.use(cookieParser());

  /* Socket.io */
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  /* App Port */
  await app.listen(publicRuntimeConfig.application.port);
}
bootstrap();
