import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PpazApiGatewayModule } from './ppaz-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(PpazApiGatewayModule);
  
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
    .setTitle('PPAZ API Gateway')
    .setDescription('API Gateway para el Sistema de Prácticas Pre-Profesionales - Universidad Peruana Unión')
    .setVersion('1.0')
    .addTag('usuarios', 'Gestión de usuarios del sistema')
    .addTag('roles', 'Gestión de roles y permisos')
    .addTag('alumnos', 'Gestión de estudiantes')
    .addTag('facultades', 'Gestión de facultades')
    .addTag('escuelas', 'Gestión de escuelas profesionales')
    .addTag('empresas', 'Gestión de empresas para prácticas')
    .addTag('cartas', 'Gestión de cartas de presentación')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.port ?? 3000);
  console.log(`🚀 API Gateway running on: http://localhost:${process.env.port ?? 3000}`);
  console.log(`📚 Swagger documentation: http://localhost:${process.env.port ?? 3000}/api/docs`);
}
bootstrap();
