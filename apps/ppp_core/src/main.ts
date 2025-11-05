import { NestFactory } from '@nestjs/core';
import { PppCoreModule } from './ppp_core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PppCoreModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001
      }
    }
  );
  await app.listen();
}
bootstrap();
