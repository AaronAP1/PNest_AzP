import { Module } from '@nestjs/common';
import { PpazApiGatewayController } from './ppaz-api-gateway.controller';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';

@Module({
  imports: [],
  controllers: [PpazApiGatewayController],
  providers: [PpazApiGatewayService],
})
export class PpazApiGatewayModule {}
