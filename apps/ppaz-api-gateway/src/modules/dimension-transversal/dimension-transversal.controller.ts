import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('dimension-transversal')
@Controller('dimension-transversal')
export class DimensionTransversalController {
  private readonly evaluacionesServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_EVALUACIONES_HOST');
    const port = this.configService.get<number>('PPP_EVALUACIONES_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.evaluacionesServiceUrl = isProduction 
      ? `https://${host}` 
      : `http://${host}:${port}`;
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva dimensión transversal' })
  @ApiResponse({ status: 201, description: 'Dimensión transversal creada exitosamente' })
  create(@Body() createDto: any): Observable<any> {
    return this.httpService
      .post(`${this.evaluacionesServiceUrl}/dimension-transversal`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las dimensiones transversales' })
  @ApiResponse({ status: 200, description: 'Lista de dimensiones transversales obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/dimension-transversal`)
      .pipe(map((response) => response.data));
  }

  @Get('activas')
  @ApiOperation({ summary: 'Listar dimensiones transversales activas' })
  @ApiResponse({ status: 200, description: 'Lista de dimensiones transversales activas' })
  findAllActivas(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/dimension-transversal/activas`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener dimensión transversal por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la dimensión transversal' })
  @ApiResponse({ status: 200, description: 'Dimensión transversal encontrada' })
  @ApiResponse({ status: 404, description: 'Dimensión transversal no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/dimension-transversal/${id}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar dimensión transversal' })
  @ApiParam({ name: 'id', description: 'UUID de la dimensión transversal' })
  @ApiResponse({ status: 200, description: 'Dimensión transversal actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Dimensión transversal no encontrada' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.evaluacionesServiceUrl}/dimension-transversal/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar dimensión transversal' })
  @ApiParam({ name: 'id', description: 'UUID de la dimensión transversal' })
  @ApiResponse({ status: 200, description: 'Dimensión transversal eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Dimensión transversal no encontrada' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.evaluacionesServiceUrl}/dimension-transversal/${id}`)
      .pipe(map((response) => response.data));
  }
}
