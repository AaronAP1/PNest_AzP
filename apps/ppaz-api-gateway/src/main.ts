import { NestFactory } from '@nestjs/core';
import { PpazApiGatewayModule } from './ppaz-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(PpazApiGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
