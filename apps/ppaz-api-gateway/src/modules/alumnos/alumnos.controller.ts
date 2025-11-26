import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@ApiTags('alumnos')
@Controller('alumnos')
export class AlumnosController {
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
  @ApiOperation({ summary: 'Crear un nuevo alumno', description: 'Registra un alumno vinculado a un usuario y escuela' })
  @ApiBody({ type: CreateAlumnoDto })
  @ApiResponse({ status: 201, description: 'Alumno creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos, usuario o escuela no existe' })
  @ApiResponse({ status: 409, description: 'El código o usuario ya está registrado' })
  create(@Body() createAlumnoDto: CreateAlumnoDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/alumnos`, createAlumnoDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los alumnos', description: 'Obtiene todos los alumnos con información de usuario y escuela' })
  @ApiResponse({ status: 200, description: 'Lista de alumnos obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/alumnos`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener alumno por ID', description: 'Busca un alumno específico por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/alumnos/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Buscar alumno por usuario', description: 'Obtiene el registro de alumno asociado a un usuario' })
  @ApiParam({ name: 'usuarioId', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findByUsuario(@Param('usuarioId') usuarioId: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/alumnos/usuario/${usuarioId}`)
      .pipe(map((response) => response.data));
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar alumno por código', description: 'Busca un alumno por su código de matrícula' })
  @ApiParam({ name: 'codigo', description: 'Código del alumno', type: 'string', example: '2021001234' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findByCodigo(@Param('codigo') codigo: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/alumnos/codigo/${codigo}`)
      .pipe(map((response) => response.data));
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Listar alumnos por escuela', description: 'Obtiene todos los alumnos de una escuela específica' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de alumnos obtenida' })
  findByEscuela(@Param('idEscuela') idEscuela: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/alumnos?escuela=${idEscuela}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar alumno', description: 'Actualiza los datos de un alumno existente' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiBody({ type: UpdateAlumnoDto })
  @ApiResponse({ status: 200, description: 'Alumno actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  update(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto): Observable<any> {
    return this.httpService
      .patch(`${this.authServiceUrl}/alumnos/${id}`, updateAlumnoDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar alumno', description: 'Elimina un alumno del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/alumnos/${id}`)
      .pipe(map((response) => response.data));
  }
}
