import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { publicRuntimeConfig, initSwaggerConfig } from './shared/config';
import { AppModule } from './app.module';
import { corsInitializeConfig } from './shared/config/cors-initialize.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Api Prefix */
  app.setGlobalPrefix(publicRuntimeConfig.application.apiPrefix);

  /* Swagger */
  initSwaggerConfig(app);

  /* CORS */
  corsInitializeConfig(app);

  /* Socket.io */
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  await app.listen(publicRuntimeConfig.application.port);
}
bootstrap();
