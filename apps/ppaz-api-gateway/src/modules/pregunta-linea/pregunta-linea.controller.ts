import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatePreguntaLineaDto } from './dto/create-pregunta-linea.dto';

@ApiTags('pregunta-linea')
@Controller('pregunta-linea')
export class PreguntaLineaController {
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
  @ApiOperation({ summary: 'Asignar pregunta a línea de facultad' })
  @ApiResponse({ status: 201, description: 'Asignación creada exitosamente' })
  create(@Body() createDto: any): Observable<any> {
    return this.httpService
      .post(`${this.evaluacionesServiceUrl}/pregunta-linea`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las asignaciones pregunta-línea' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/pregunta-linea`)
      .pipe(map((response) => response.data));
  }

  @Get('linea/:idLinea')
  @ApiOperation({ summary: 'Obtener preguntas de una línea' })
  @ApiParam({ name: 'idLinea', description: 'UUID de la línea de facultad' })
  findByLinea(@Param('idLinea') idLinea: string): Observable<any> {
    return this.httpService
      .get(`${this.evaluacionesServiceUrl}/pregunta-linea/linea/${idLinea}`)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar asignación pregunta-línea' })
  @ApiParam({ name: 'id', description: 'UUID de la asignación' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.evaluacionesServiceUrl}/pregunta-linea/${id}`)
      .pipe(map((response) => response.data));
  }
}
