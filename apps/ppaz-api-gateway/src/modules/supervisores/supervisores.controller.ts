import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('supervisores')
@Controller('supervisores')
export class SupervisoresController {
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
  @ApiOperation({ summary: 'Crear un nuevo supervisor' })
  @ApiResponse({ status: 201, description: 'Supervisor creado exitosamente' })
  create(@Body() createDto: any): Observable<any> {
    return this.httpService
      .post(`${this.academicServiceUrl}/supervisores`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los supervisores' })
  @ApiResponse({ status: 200, description: 'Lista de supervisores obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/supervisores`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener supervisor por ID' })
  @ApiParam({ name: 'id', description: 'UUID del supervisor' })
  @ApiResponse({ status: 200, description: 'Supervisor encontrado' })
  @ApiResponse({ status: 404, description: 'Supervisor no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/supervisores/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Buscar supervisor por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'UUID del usuario' })
  findByUsuario(@Param('usuarioId') usuarioId: string): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/supervisores/usuario/${usuarioId}`)
      .pipe(map((response) => response.data));
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Buscar supervisores por escuela' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela' })
  findByEscuela(@Param('idEscuela') idEscuela: string): Observable<any> {
    return this.httpService
      .get(`${this.academicServiceUrl}/supervisores/escuela/${idEscuela}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar supervisor' })
  @ApiParam({ name: 'id', description: 'UUID del supervisor' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.academicServiceUrl}/supervisores/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar supervisor' })
  @ApiParam({ name: 'id', description: 'UUID del supervisor' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.academicServiceUrl}/supervisores/${id}`)
      .pipe(map((response) => response.data));
  }
}
