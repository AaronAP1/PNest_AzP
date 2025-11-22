import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateEvaluacionSupervisorDto } from './dto/create-evaluacion-supervisor.dto';

@ApiTags('evaluacion-supervisor')
@Controller('evaluacion-supervisor')
export class EvaluacionSupervisorController {
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
  @ApiOperation({ summary: 'Crear una nueva evaluación de supervisor' })
  @ApiBody({ type: CreateEvaluacionSupervisorDto })
  @ApiResponse({ status: 201, description: 'Evaluación creada exitosamente' })
  create(@Body() createDto: CreateEvaluacionSupervisorDto): Observable<any> {
    return this.httpService
      .post(`${this.evaluacionesServiceUrl}/evaluacion-supervisor`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las evaluaciones de supervisor' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-supervisor`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evaluación por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-supervisor/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('solicitud/:idSolicitud')
  @ApiOperation({ summary: 'Obtener evaluaciones por solicitud PPP' })
  @ApiParam({ name: 'idSolicitud', description: 'UUID de la solicitud' })
  findBySolicitud(@Param('idSolicitud') idSolicitud: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-supervisor/solicitud/${idSolicitud}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evaluación de supervisor' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.evaluacionesServiceUrl}/evaluacion-supervisor/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evaluación' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.evaluacionesServiceUrl}/evaluacion-supervisor/${id}`)
      .pipe(map((response) => response.data));
  }
}
