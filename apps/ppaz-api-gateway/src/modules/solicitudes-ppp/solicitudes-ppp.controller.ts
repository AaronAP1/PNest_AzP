import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('solicitudes-ppp')
@Controller('solicitudes-ppp')
export class SolicitudesPppController {
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
  @ApiOperation({ summary: 'Crear una nueva solicitud de PPP' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  create(@Body() createDto: any): Observable<any> {
    return this.httpService
      .post(`${this.coreServiceUrl}/solicitudes-ppp`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las solicitudes de PPP' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/solicitudes-ppp`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener solicitud por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/solicitudes-ppp/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('alumno/:idAlumno')
  @ApiOperation({ summary: 'Buscar solicitudes por alumno' })
  @ApiParam({ name: 'idAlumno', description: 'UUID del alumno' })
  findByAlumno(@Param('idAlumno') idAlumno: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/solicitudes-ppp/alumno/${idAlumno}`)
      .pipe(map((response) => response.data));
  }

  @Get('supervisor/:idSupervisor')
  @ApiOperation({ summary: 'Buscar solicitudes por supervisor' })
  @ApiParam({ name: 'idSupervisor', description: 'UUID del supervisor' })
  findBySupervisor(@Param('idSupervisor') idSupervisor: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/solicitudes-ppp/supervisor/${idSupervisor}`)
      .pipe(map((response) => response.data));
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Buscar solicitudes por estado' })
  @ApiParam({ name: 'estado', description: 'Estado de la solicitud' })
  findByEstado(@Param('estado') estado: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/solicitudes-ppp/estado/${estado}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar solicitud' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.coreServiceUrl}/solicitudes-ppp/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.coreServiceUrl}/solicitudes-ppp/${id}`)
      .pipe(map((response) => response.data));
  }
}
