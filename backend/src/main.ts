import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { publicRuntimeConfig } from './config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(publicRuntimeConfig.application.apiPrefix);

  const config = new DocumentBuilder()
    .setTitle(publicRuntimeConfig.swagger.title)
    .setDescription(publicRuntimeConfig.swagger.description)
    .setVersion(publicRuntimeConfig.application.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    publicRuntimeConfig.application.apiPrefix,
    app,
    document,
    {
      swaggerOptions: { docExpansion: 'none', showRequestDuration: true }
    }
  );

  await app.listen(publicRuntimeConfig.application.port ?? 4000);
}
bootstrap();
