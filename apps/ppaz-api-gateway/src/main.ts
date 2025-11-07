import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PpazApiGatewayModule } from './ppaz-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(PpazApiGatewayModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', 'localhost');
  const swaggerTitle = configService.get<string>('SWAGGER_TITLE', 'PPP API Gateway');
  const swaggerDescription = configService.get<string>('SWAGGER_DESCRIPTION', 'API Gateway para el sistema de Prácticas Pre-Profesionales');
  const swaggerVersion = configService.get<string>('SWAGGER_VERSION', '1.0');
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
  
  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .addTag('health', 'Health checks del sistema')
    .addTag('usuarios', 'Gestión de usuarios del sistema')
    .addTag('roles', 'Gestión de roles y permisos')
    .addTag('alumnos', 'Gestión de estudiantes')
    .addTag('facultades', 'Gestión de facultades')
    .addTag('escuelas', 'Gestión de escuelas profesionales')
    .addTag('secretarias', 'Gestión de secretarías')
    .addTag('empresas', 'Gestión de empresas para prácticas')
    .addTag('cartas', 'Gestión de cartas de presentación')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port, host);
  logger.log(`🚀 API Gateway running on: http://${host}:${port}`);
  logger.log(`📚 Swagger documentation: http://${host}:${port}/${swaggerPath}`);
  logger.log(`💚 Health check: http://${host}:${port}/health`);
}
bootstrap();
