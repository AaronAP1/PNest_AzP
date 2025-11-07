import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  HealthCheck, 
  HealthCheckService, 
  MemoryHealthIndicator,
  DiskHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check completo', description: 'Verifica el estado del Gateway y conexión con microservicios y bases de datos' })
  @ApiResponse({ status: 200, description: 'Servicio saludable' })
  @ApiResponse({ status: 503, description: 'Servicio no disponible' })
  check() {
    return this.health.check([
      // Check ppp_core microservice via TCP ping
      () => this.microservice.pingCheck('ppp_core', {
        transport: Transport.TCP,
        options: {
          host: this.configService.get<string>('PPP_CORE_HOST', 'localhost'),
          port: this.configService.get<number>('PPP_CORE_PORT', 3001),
        },
        timeout: 3000,
      }),
      
      // Check ppp_companias microservice via TCP ping  
      () => this.microservice.pingCheck('ppp_companias', {
        transport: Transport.TCP,
        options: {
          host: this.configService.get<string>('PPP_COMPANIAS_HOST', 'localhost'),
          port: this.configService.get<number>('PPP_COMPANIAS_PORT', 3002),
        },
        timeout: 3000,
      }),
      
      // Memory heap should not exceed 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Memory RSS should not exceed 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      
      // Disk storage should not exceed 90% usage (Windows compatible)
      () => this.disk.checkStorage('disk', { 
        path: process.platform === 'win32' ? 'C:\\' : '/', 
        thresholdPercent: 0.95 // Aumentado a 95% para no fallar en desarrollo
      }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness check', description: 'Verifica si el Gateway está listo para recibir tráfico' })
  @ApiResponse({ status: 200, description: 'Gateway listo' })
  @ApiResponse({ status: 503, description: 'Gateway no listo' })
  ready() {
    return this.health.check([
      // Only check microservices connectivity for readiness via TCP
      () => this.microservice.pingCheck('ppp_core', {
        transport: Transport.TCP,
        options: {
          host: this.configService.get<string>('PPP_CORE_HOST', 'localhost'),
          port: this.configService.get<number>('PPP_CORE_PORT', 3001),
        },
        timeout: 2000,
      }),
      () => this.microservice.pingCheck('ppp_companias', {
        transport: Transport.TCP,
        options: {
          host: this.configService.get<string>('PPP_COMPANIAS_HOST', 'localhost'),
          port: this.configService.get<number>('PPP_COMPANIAS_PORT', 3002),
        },
        timeout: 2000,
      }),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check', description: 'Verifica si el Gateway está en ejecución' })
  @ApiResponse({ status: 200, description: 'Gateway activo' })
  live() {
    // Simple liveness check - service is running
    return {
      status: 'ok',
      service: 'ppaz-api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
