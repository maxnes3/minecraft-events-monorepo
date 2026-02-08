import { NestFactory } from '@nestjs/core';
import { publicRuntimeConfig, initSwaggerConfig } from './shared/config';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(publicRuntimeConfig.application.apiPrefix);

  initSwaggerConfig(app);

  app.enableCors({
    origin: '*',
    credentials: true
  });

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  await app.listen(publicRuntimeConfig.application.port);
}
bootstrap();
