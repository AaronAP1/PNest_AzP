import { NestFactory } from '@nestjs/core';
import { PppAuthServiceModule } from './ppp-auth-service.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
  logger.log(`🔗 AUTH Service TCP microservice patterns enabled on port ${tcpPort}`);
}
bootstrap();
