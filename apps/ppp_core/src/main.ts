import { NestFactory } from '@nestjs/core';
import { PppCoreModule } from './ppp_core.module';

async function bootstrap() {
  const app = await NestFactory.create(PppCoreModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
