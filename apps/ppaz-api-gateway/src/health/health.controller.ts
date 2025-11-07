import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  HealthCheck, 
  HealthCheckService, 
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly coreHost: string;
  private readonly corePort: number;
  private readonly companiasHost: string;
  private readonly companiasPort: number;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigService,
  ) {
    this.coreHost = this.configService.get<string>('PPP_CORE_HOST', 'localhost');
    this.corePort = this.configService.get<number>('PPP_CORE_PORT', 3001);
    this.companiasHost = this.configService.get<string>('PPP_COMPANIAS_HOST', 'localhost');
    this.companiasPort = this.configService.get<number>('PPP_COMPANIAS_PORT', 3002);
  }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check completo', description: 'Verifica el estado del Gateway y conexión con microservicios y bases de datos' })
  @ApiResponse({ status: 200, description: 'Servicio saludable' })
  @ApiResponse({ status: 503, description: 'Servicio no disponible' })
  check() {
    return this.health.check([
      // Check ppp_core microservice
      () => this.http.pingCheck('ppp_core', `http://${this.coreHost}:${this.corePort}/health/live`, {
        timeout: 3000,
      }),
      
      // Check ppp_companias microservice
      () => this.http.pingCheck('ppp_companias', `http://${this.companiasHost}:${this.companiasPort}/health/live`, {
        timeout: 3000,
      }),
      
      // Memory heap should not exceed 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Memory RSS should not exceed 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      
      // Disk storage should not exceed 90% usage
      () => this.disk.checkStorage('disk', { 
        path: '/', 
        thresholdPercent: 0.9 
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
      // Only check microservices connectivity for readiness
      () => this.http.pingCheck('ppp_core', `http://${this.coreHost}:${this.corePort}/health/live`, {
        timeout: 2000,
      }),
      () => this.http.pingCheck('ppp_companias', `http://${this.companiasHost}:${this.companiasPort}/health/live`, {
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
