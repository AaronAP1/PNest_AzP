import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('sunat')
@Controller('sunat')
export class SunatController {
  private readonly coreServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_COMPANIAS_HOST');
    const port = this.configService.get<number>('PPP_COMPANIAS_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.coreServiceUrl = isProduction 
      ? `https://${host}` 
      : `http://${host}:${port}`;
    
    console.log(`[SunatController] Service URL: ${this.coreServiceUrl}`);
  }

  @Get('consultar-ruc')
  @ApiOperation({ summary: 'Consultar información de empresa por RUC en SUNAT' })
  @ApiQuery({ name: 'ruc', description: 'Número de RUC de 11 dígitos', example: '20100047218' })
  @ApiResponse({ status: 200, description: 'Información obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'RUC inválido' })
  @ApiResponse({ status: 404, description: 'RUC no encontrado' })
  consultarRuc(@Query('ruc') ruc: string): Observable<any> {
    console.log(`[SunatController] Consultando RUC: ${ruc}, URL: ${this.coreServiceUrl}`);
    return this.httpService
      .get(`${this.coreServiceUrl}/sunat/consultar-ruc`, {
        params: { ruc },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('[SunatController] Error:', error.message);
          throw new HttpException(
            error.response?.data?.message || 'Error al consultar RUC',
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
  }
}
