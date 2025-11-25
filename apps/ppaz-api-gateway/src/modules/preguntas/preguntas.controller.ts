import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';

@ApiTags('preguntas')
@Controller('preguntas')
export class PreguntasController {
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
  @ApiOperation({ summary: 'Crear una nueva pregunta' })
  @ApiBody({ type: CreatePreguntaDto })
  @ApiResponse({ status: 201, description: 'Pregunta creada exitosamente' })
  create(@Body() createDto: CreatePreguntaDto): Observable<any> {
    return this.httpService
      .post(`${this.evaluacionesServiceUrl}/preguntas`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las preguntas' })
  @ApiResponse({ status: 200, description: 'Lista de preguntas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/preguntas`)
      .pipe(map((response) => response.data));
  }

  @Get('activas')
  @ApiOperation({ summary: 'Listar preguntas activas' })
  @ApiResponse({ status: 200, description: 'Lista de preguntas activas' })
  findAllActivas(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/preguntas/activas`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pregunta por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la pregunta' })
  @ApiResponse({ status: 200, description: 'Pregunta encontrada' })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/preguntas/${id}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar pregunta' })
  @ApiParam({ name: 'id', description: 'UUID de la pregunta' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.evaluacionesServiceUrl}/preguntas/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar pregunta' })
  @ApiParam({ name: 'id', description: 'UUID de la pregunta' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.evaluacionesServiceUrl}/preguntas/${id}`)
      .pipe(map((response) => response.data));
  }
}
