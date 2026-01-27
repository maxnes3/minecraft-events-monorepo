import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { publicRuntimeConfig } from './shared/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(publicRuntimeConfig.application.apiPrefix);

  const config = new DocumentBuilder()
    .setTitle(publicRuntimeConfig.swagger.title)
    .setDescription(publicRuntimeConfig.swagger.description)
    .setVersion(publicRuntimeConfig.application.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: publicRuntimeConfig.jwt.authorizationHeader,
        description: 'Enter JWT token',
        in: 'header'
      },
      publicRuntimeConfig.jwt.authorizationHeader
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    publicRuntimeConfig.application.apiPrefix,
    app,
    document,
    {
      swaggerOptions: {
        docExpansion: 'list',
        showRequestDuration: true,
        persistAuthorization: true
      }
    }
  );

  await app.listen(publicRuntimeConfig.application.port);
}
bootstrap();
