import { NestFactory } from '@nestjs/core';
import { PppAuthServiceModule } from './ppp-auth-service.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Crear aplicación HTTP (compatible con Azure)
  const app = await NestFactory.create(PppAuthServiceModule);
  
  const httpPort = parseInt(process.env.PORT || '3001');
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

  await app.listen(httpPort, host);
  logger.log(`🔒 AUTH Service HTTP server running on http://${host}:${httpPort}`);
}
bootstrap();
