import { NestFactory } from '@nestjs/core';
import { PppCompañiasModule } from './ppp_compañias.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(PppCompañiasModule);
  const configService = appContext.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 3002);
  const host = configService.get<string>('HOST', 'localhost');
  const appName = configService.get<string>('APP_NAME', 'ppp_companias');

  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PppCompañiasModule,
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
