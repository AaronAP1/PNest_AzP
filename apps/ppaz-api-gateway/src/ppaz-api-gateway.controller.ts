import { Controller, Get } from '@nestjs/common';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';

@Controller()
export class PpazApiGatewayController {
  constructor(private readonly ppazApiGatewayService: PpazApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.ppazApiGatewayService.getHello();
  }
}
