import { NestFactory } from '@nestjs/core';
import { publicRuntimeConfig, initSwaggerConfig } from './shared/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(publicRuntimeConfig.application.apiPrefix);

  initSwaggerConfig(app);

  await app.listen(publicRuntimeConfig.application.port);
}
bootstrap();
