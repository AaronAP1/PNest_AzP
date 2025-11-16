import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  @Get()
  @MessagePattern('health.check')
  check() {
    return {
      status: 'ok',
      service: 'ppp-evaluaciones-service',
      timestamp: new Date().toISOString(),
    };
  }
}
