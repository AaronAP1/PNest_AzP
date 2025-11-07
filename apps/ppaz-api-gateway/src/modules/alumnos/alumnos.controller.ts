import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@ApiTags('alumnos')
@Controller('alumnos')
export class AlumnosController {
  constructor(
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alumno', description: 'Registra un alumno vinculado a un usuario y escuela' })
  @ApiBody({ type: CreateAlumnoDto })
  @ApiResponse({ status: 201, description: 'Alumno creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos, usuario o escuela no existe' })
  @ApiResponse({ status: 409, description: 'El código o usuario ya está registrado' })
  create(@Body() createAlumnoDto: CreateAlumnoDto): Observable<any> {
    return this.coreClient.send({ cmd: 'create_alumno' }, createAlumnoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los alumnos', description: 'Obtiene todos los alumnos con información de usuario y escuela' })
  @ApiResponse({ status: 200, description: 'Lista de alumnos obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.coreClient.send({ cmd: 'find_all_alumnos' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener alumno por ID', description: 'Busca un alumno específico por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_one_alumno' }, id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Buscar alumno por usuario', description: 'Obtiene el registro de alumno asociado a un usuario' })
  @ApiParam({ name: 'usuarioId', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findByUsuario(@Param('usuarioId') usuarioId: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_alumno_by_usuario' }, usuarioId);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar alumno por código', description: 'Busca un alumno por su código de matrícula' })
  @ApiParam({ name: 'codigo', description: 'Código del alumno', type: 'string', example: '2021001234' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findByCodigo(@Param('codigo') codigo: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_alumno_by_codigo' }, codigo);
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Listar alumnos por escuela', description: 'Obtiene todos los alumnos de una escuela específica' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de alumnos obtenida' })
  findByEscuela(@Param('idEscuela') idEscuela: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_alumnos_by_escuela' }, idEscuela);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar alumno', description: 'Actualiza los datos de un alumno existente' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiBody({ type: UpdateAlumnoDto })
  @ApiResponse({ status: 200, description: 'Alumno actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  update(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto): Observable<any> {
    return this.coreClient.send({ cmd: 'update_alumno' }, { id, updateAlumnoDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar alumno', description: 'Elimina un alumno del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'remove_alumno' }, id);
  }
}
