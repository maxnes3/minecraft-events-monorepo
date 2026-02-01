import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { publicRuntimeConfig } from './runtime.config';

export function initSwaggerConfig(app: INestApplication): void {
  if (!publicRuntimeConfig.swagger.enabled) {
    return;
  }

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
}
