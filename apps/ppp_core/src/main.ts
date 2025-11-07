import { NestFactory } from '@nestjs/core';
import { PppCoreModule } from './ppp_core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(PppCoreModule);
  const configService = appContext.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 3001);
  const host = configService.get<string>('HOST', 'localhost');
  const appName = configService.get<string>('APP_NAME', 'ppp_core');

  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PppCoreModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      }
    }
  );
  
  await app.listen();
  logger.log(`🚀 ${appName} microservice is running on ${host}:${port}`);
}
bootstrap();
