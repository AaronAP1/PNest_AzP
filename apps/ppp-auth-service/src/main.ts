import { NestFactory } from '@nestjs/core';
import { PppAuthServiceModule } from './ppp-auth-service.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Crear aplicación híbrida (HTTP + Microservice patterns)
  const app = await NestFactory.create(PppAuthServiceModule);
  
  const httpPort = parseInt(process.env.PORT || '3002');
  const tcpPort = 3011; // TCP para comunicación entre microservicios
  const host = process.env.HOST || '0.0.0.0';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS para comunicación con API Gateway
  app.enableCors();

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('PPP Auth Service API')
    .setDescription('Autenticación y Autorización - Usuarios, Roles, Privilegios')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Conectar microservice TCP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort, host);
  
  logger.log(`🔒 AUTH Service HTTP server running on http://${host}:${httpPort}`);
  logger.log(`📚 Swagger docs: http://${host}:${httpPort}/api/docs`);
  logger.log(`🔗 AUTH Service TCP microservice patterns enabled on port ${tcpPort}`);
}
bootstrap();
