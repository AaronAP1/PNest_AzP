import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SunatService, SunatRucResponse } from './sunat.service';

@ApiTags('sunat')
@Controller('sunat')
export class SunatController {
  constructor(private readonly sunatService: SunatService) {}

  @Get('consultar-ruc')
  @ApiOperation({ summary: 'Consultar información de empresa por RUC en SUNAT' })
  @ApiQuery({ name: 'ruc', description: 'Número de RUC de 11 dígitos', example: '20100047218' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información de la empresa obtenida exitosamente',
    schema: {
      example: {
        razon_social: 'EMPRESA EJEMPLO S.A.C.',
        numero_documento: '20100047218',
        direccion: 'AV. EJEMPLO NRO 123 URB. EJEMPLO'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'RUC inválido' })
  @ApiResponse({ status: 404, description: 'RUC no encontrado' })
  async consultarRuc(@Query('ruc') ruc: string): Promise<SunatRucResponse> {
    if (!ruc) {
      throw new HttpException('Parámetro RUC es requerido', HttpStatus.BAD_REQUEST);
    }

    return this.sunatService.consultarRuc(ruc);
  }
}
