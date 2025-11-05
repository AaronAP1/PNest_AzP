import { NestFactory } from '@nestjs/core';
import { PppCompañiasModule } from './ppp_compañias.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PppCompañiasModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002
      }
    }
  );
  await app.listen();
}
bootstrap();
