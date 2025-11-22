import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@ApiTags('supervisores')
@Controller('supervisores')
export class SupervisoresController {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_AUTH_HOST');
    const port = this.configService.get<number>('PPP_AUTH_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.authServiceUrl = isProduction 
      ? `https://${host}` 
      : `http://${host}:${port}`;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo supervisor' })
  @ApiBody({ type: CreateSupervisorDto })
  @ApiResponse({ status: 201, description: 'Supervisor creado exitosamente' })
  create(@Body() createDto: CreateSupervisorDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/supervisores`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los supervisores' })
  @ApiResponse({ status: 200, description: 'Lista de supervisores obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/supervisores`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener supervisor por ID' })
  @ApiParam({ name: 'id', description: 'UUID del supervisor' })
  @ApiResponse({ status: 200, description: 'Supervisor encontrado' })
  @ApiResponse({ status: 404, description: 'Supervisor no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/supervisores/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Buscar supervisor por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'UUID del usuario' })
  findByUsuario(@Param('usuarioId') usuarioId: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/supervisores/usuario/${usuarioId}`)
      .pipe(map((response) => response.data));
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Buscar supervisores por escuela' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela' })
  findByEscuela(@Param('idEscuela') idEscuela: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/supervisores/escuela/${idEscuela}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar supervisor' })
  @ApiParam({ name: 'id', description: 'UUID del supervisor' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.authServiceUrl}/supervisores/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar supervisor' })
  @ApiParam({ name: 'id', description: 'UUID del supervisor' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/supervisores/${id}`)
      .pipe(map((response) => response.data));
  }
}
