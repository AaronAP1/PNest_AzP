import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateReunionDto } from './dto/create-reunion.dto';

@ApiTags('reuniones')
@Controller('reuniones')
export class ReunionesController {
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
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reunión' })
  @ApiBody({ type: CreateReunionDto })
  @ApiResponse({ status: 201, description: 'Reunión creada exitosamente' })
  create(@Body() createDto: CreateReunionDto): Observable<any> {
    return this.httpService
      .post(`${this.coreServiceUrl}/reuniones`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las reuniones' })
  @ApiResponse({ status: 200, description: 'Lista de reuniones obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/reuniones`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reunión por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la reunión' })
  @ApiResponse({ status: 200, description: 'Reunión encontrada' })
  @ApiResponse({ status: 404, description: 'Reunión no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/reuniones/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('solicitud/:idSolicitud')
  @ApiOperation({ summary: 'Buscar reuniones por solicitud' })
  @ApiParam({ name: 'idSolicitud', description: 'UUID de la solicitud' })
  findBySolicitud(@Param('idSolicitud') idSolicitud: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/reuniones/solicitud/${idSolicitud}`)
      .pipe(map((response) => response.data));
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Buscar reuniones por estado' })
  @ApiParam({ name: 'estado', description: 'Estado de la reunión' })
  findByEstado(@Param('estado') estado: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/reuniones/estado/${estado}`)
      .pipe(map((response) => response.data));
  }

  @Get('estadisticas/por-estado')
  @ApiOperation({ summary: 'Contar reuniones por estado' })
  countByEstado(): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/reuniones/estadisticas/por-estado`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reunión' })
  @ApiParam({ name: 'id', description: 'UUID de la reunión' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.coreServiceUrl}/reuniones/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reunión' })
  @ApiParam({ name: 'id', description: 'UUID de la reunión' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.coreServiceUrl}/reuniones/${id}`)
      .pipe(map((response) => response.data));
  }
}
