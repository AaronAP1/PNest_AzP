import { NestFactory } from '@nestjs/core';
import { PppCoreModule } from './ppp_core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Crear aplicación híbrida (HTTP + Microservice patterns)
  const app = await NestFactory.create(PppCoreModule);
  
  const configService = app.get(ConfigService);
  const httpPort = parseInt(process.env.PORT || '3001'); // HTTP - Lee de env o usa 3001 por defecto
  const tcpPort = 3012; // TCP para dev local - PUERTO DIFERENTE
  const host = process.env.HOST || '0.0.0.0';
  const appName = 'ppp_academic';

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Habilitar CORS para comunicación con API Gateway
  app.enableCors();

  // Conectar microservice TCP en puerto diferente (solo para dev local)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port: tcpPort, // Puerto diferente para TCP
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort, host); // HTTP en puerto principal
  
  logger.log(`🚀 ${appName} HTTP server is running on http://${host}:${httpPort}`);
  logger.log(`🔗 ${appName} TCP microservice patterns enabled on port ${tcpPort}`);
}
bootstrap();
