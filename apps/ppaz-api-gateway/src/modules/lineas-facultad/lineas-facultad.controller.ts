import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateLineaFacultadDto } from './dto/create-linea-facultad.dto';
import { UpdateLineaFacultadDto } from './dto/update-linea-facultad.dto';

@ApiTags('lineas-facultad')
@Controller('lineas-facultad')
export class LineasFacultadController {
  private readonly academicServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_CORE_HOST');
    const port = this.configService.get<number>('PPP_CORE_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.academicServiceUrl = isProduction 
      ? `https://${host}` 
      : `http://${host}:${port}`;
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva línea de facultad' })
  @ApiBody({ type: CreateLineaFacultadDto })
  @ApiResponse({ status: 201, description: 'Línea creada exitosamente' })
  create(@Body() createDto: CreateLineaFacultadDto): Observable<any> {
    return this.httpService
      .post(`${this.academicServiceUrl}/lineas-facultad`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las líneas de facultad' })
  @ApiResponse({ status: 200, description: 'Lista de líneas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/lineas-facultad`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener línea por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la línea' })
  @ApiResponse({ status: 200, description: 'Línea encontrada' })
  @ApiResponse({ status: 404, description: 'Línea no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/lineas-facultad/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Buscar líneas por escuela' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela' })
  findByEscuela(@Param('idEscuela') idEscuela: string): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/lineas-facultad/escuela/${idEscuela}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar línea' })
  @ApiParam({ name: 'id', description: 'UUID de la línea' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.academicServiceUrl}/lineas-facultad/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar línea' })
  @ApiParam({ name: 'id', description: 'UUID de la línea' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.academicServiceUrl}/lineas-facultad/${id}`)
      .pipe(map((response) => response.data));
  }
}
