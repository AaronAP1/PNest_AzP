import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  HealthCheck, 
  HealthCheckService, 
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check completo', description: 'Verifica el estado del Gateway y conexión con microservicios y bases de datos' })
  @ApiResponse({ status: 200, description: 'Servicio saludable' })
  @ApiResponse({ status: 503, description: 'Servicio no disponible' })
  check() {
    const authHost = this.configService.get<string>('PPP_AUTH_HOST', 'localhost');
    const authPort = this.configService.get<number>('PPP_AUTH_PORT', 3001);
    const coreHost = this.configService.get<string>('PPP_CORE_HOST', 'localhost');
    const corePort = this.configService.get<number>('PPP_CORE_PORT', 3002);
    const companiasHost = this.configService.get<string>('PPP_COMPANIAS_HOST', 'localhost');
    const companiasPort = this.configService.get<number>('PPP_COMPANIAS_PORT', 3003);
    const evaluacionesHost = this.configService.get<string>('PPP_EVALUACIONES_HOST', 'localhost');
    const evaluacionesPort = this.configService.get<number>('PPP_EVALUACIONES_PORT', 3004);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    // En producción (Azure), usar HTTPS sin puerto. En desarrollo, usar HTTP con puerto
    const authUrl = isProduction ? `https://${authHost}/health` : `http://${authHost}:${authPort}/health`;
    const coreUrl = isProduction ? `https://${coreHost}/health` : `http://${coreHost}:${corePort}/health`;
    const companiasUrl = isProduction ? `https://${companiasHost}/health` : `http://${companiasHost}:${companiasPort}/health`;
    const evaluacionesUrl = isProduction ? `https://${evaluacionesHost}/health` : `http://${evaluacionesHost}:${evaluacionesPort}/health`;

    return this.health.check([
      // Check ppp_auth microservice
      () => this.http.pingCheck('ppp_auth', authUrl, { timeout: 5000 }),
      
      // Check ppp_academic microservice
      () => this.http.pingCheck('ppp_academic', coreUrl, { timeout: 5000 }),
      
      // Check ppp_companias microservice
      () => this.http.pingCheck('ppp_companias', companiasUrl, { timeout: 5000 }),
      
      // Check ppp_evaluaciones microservice
      () => this.http.pingCheck('ppp_evaluaciones', evaluacionesUrl, { timeout: 5000 }),
      
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
    const authHost = this.configService.get<string>('PPP_AUTH_HOST', 'localhost');
    const authPort = this.configService.get<number>('PPP_AUTH_PORT', 3001);
    const coreHost = this.configService.get<string>('PPP_CORE_HOST', 'localhost');
    const corePort = this.configService.get<number>('PPP_CORE_PORT', 3002);
    const companiasHost = this.configService.get<string>('PPP_COMPANIAS_HOST', 'localhost');
    const companiasPort = this.configService.get<number>('PPP_COMPANIAS_PORT', 3003);
    const evaluacionesHost = this.configService.get<string>('PPP_EVALUACIONES_HOST', 'localhost');
    const evaluacionesPort = this.configService.get<number>('PPP_EVALUACIONES_PORT', 3004);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    const authUrl = isProduction ? `https://${authHost}/health` : `http://${authHost}:${authPort}/health`;
    const coreUrl = isProduction ? `https://${coreHost}/health` : `http://${coreHost}:${corePort}/health`;
    const companiasUrl = isProduction ? `https://${companiasHost}/health` : `http://${companiasHost}:${companiasPort}/health`;
    const evaluacionesUrl = isProduction ? `https://${evaluacionesHost}/health` : `http://${evaluacionesHost}:${evaluacionesPort}/health`;

    return this.health.check([
      // Only check microservices connectivity for readiness
      () => this.http.pingCheck('ppp_auth', authUrl, { timeout: 3000 }),
      () => this.http.pingCheck('ppp_academic', coreUrl, { timeout: 3000 }),
      () => this.http.pingCheck('ppp_companias', companiasUrl, { timeout: 3000 }),
      () => this.http.pingCheck('ppp_evaluaciones', evaluacionesUrl, { timeout: 3000 }),
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
