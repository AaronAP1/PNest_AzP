import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateEvaluacionPreguntaDto } from './dto/create-evaluacion-pregunta.dto';

@ApiTags('evaluacion-pregunta')
@Controller('evaluacion-pregunta')
export class EvaluacionPreguntaController {
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
  @ApiOperation({ summary: 'Crear una nueva respuesta de evaluación' })
  @ApiBody({ type: CreateEvaluacionPreguntaDto })
  @ApiResponse({ status: 201, description: 'Respuesta creada exitosamente' })
  create(@Body() createDto: CreateEvaluacionPreguntaDto): Observable<any> {
    return this.httpService
      .post(`${this.evaluacionesServiceUrl}/evaluacion-pregunta`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las respuestas de evaluación' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-pregunta`)
      .pipe(map((response) => response.data));
  }

  @Get('evaluacion-supervisor/:idEvaluacion')
  @ApiOperation({ summary: 'Obtener respuestas de una evaluación de supervisor' })
  @ApiParam({ name: 'idEvaluacion', description: 'UUID de la evaluación' })
  findByEvaluacionSupervisor(@Param('idEvaluacion') idEvaluacion: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/evaluacion-pregunta/evaluacion-supervisor/${idEvaluacion}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar respuesta' })
  @ApiParam({ name: 'id', description: 'UUID de la respuesta' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.evaluacionesServiceUrl}/evaluacion-pregunta/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar respuesta' })
  @ApiParam({ name: 'id', description: 'UUID de la respuesta' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.evaluacionesServiceUrl}/evaluacion-pregunta/${id}`)
      .pipe(map((response) => response.data));
  }
}
