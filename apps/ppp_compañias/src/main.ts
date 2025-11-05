import { NestFactory } from '@nestjs/core';
import { PppCompañiasModule } from './ppp_compañias.module';

async function bootstrap() {
  const app = await NestFactory.create(PppCompañiasModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
