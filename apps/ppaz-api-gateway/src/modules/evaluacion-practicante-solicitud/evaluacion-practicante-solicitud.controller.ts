import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateEvaluacionPracticanteSolicitudDto } from './dto/create-evaluacion-practicante-solicitud.dto';

@ApiTags('evaluacion-practicante-solicitud')
@Controller('evaluacion-practicante-solicitud')
export class EvaluacionPracticanteSolicitudController {
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
  @ApiOperation({ summary: 'Crear solicitud de evaluación de practicante' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  create(@Body() createDto: any): Observable<any> {
    return this.httpService
      .post(`${this.evaluacionesServiceUrl}/evaluacion-practicante-solicitud`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las solicitudes de evaluación' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-practicante-solicitud`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener solicitud por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-practicante-solicitud/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('solicitud-ppp/:idSolicitudPpp')
  @ApiOperation({ summary: 'Obtener solicitudes por solicitud PPP' })
  @ApiParam({ name: 'idSolicitudPpp', description: 'UUID de la solicitud PPP' })
  findBySolicitudPpp(@Param('idSolicitudPpp') idSolicitudPpp: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-practicante-solicitud/solicitud-ppp/${idSolicitudPpp}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar solicitud de evaluación' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.evaluacionesServiceUrl}/evaluacion-practicante-solicitud/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.evaluacionesServiceUrl}/evaluacion-practicante-solicitud/${id}`)
      .pipe(map((response) => response.data));
  }
}
