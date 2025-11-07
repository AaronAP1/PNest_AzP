import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateEscuelaDto } from './dto/create-escuela.dto';
import { UpdateEscuelaDto } from './dto/update-escuela.dto';

@ApiTags('escuelas')
@Controller('escuelas')
export class EscuelasController {
  constructor(
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva escuela', description: 'Registra una nueva escuela profesional asociada a una facultad' })
  @ApiBody({ type: CreateEscuelaDto })
  @ApiResponse({ status: 201, description: 'Escuela creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o facultad no existe' })
  @ApiResponse({ status: 409, description: 'Ya existe una escuela con ese código' })
  create(@Body() createEscuelaDto: CreateEscuelaDto): Observable<any> {
    return this.coreClient.send({ cmd: 'create_escuela' }, createEscuelaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las escuelas', description: 'Obtiene todas las escuelas con información de su facultad' })
  @ApiResponse({ status: 200, description: 'Lista de escuelas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.coreClient.send({ cmd: 'find_all_escuelas' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener escuela por ID', description: 'Busca una escuela específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la escuela', type: 'string' })
  @ApiResponse({ status: 200, description: 'Escuela encontrada' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_one_escuela' }, id);
  }

  @Get('facultad/:idFacultad')
  @ApiOperation({ summary: 'Listar escuelas por facultad', description: 'Obtiene todas las escuelas de una facultad específica' })
  @ApiParam({ name: 'idFacultad', description: 'UUID de la facultad', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de escuelas obtenida' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  findByFacultad(@Param('idFacultad') idFacultad: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_escuelas_by_facultad' }, idFacultad);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar escuela', description: 'Actualiza los datos de una escuela existente' })
  @ApiParam({ name: 'id', description: 'UUID de la escuela', type: 'string' })
  @ApiBody({ type: UpdateEscuelaDto })
  @ApiResponse({ status: 200, description: 'Escuela actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  update(@Param('id') id: string, @Body() updateEscuelaDto: UpdateEscuelaDto): Observable<any> {
    return this.coreClient.send({ cmd: 'update_escuela' }, { id, updateEscuelaDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar escuela', description: 'Elimina una escuela (solo si no tiene alumnos asociados)' })
  @ApiParam({ name: 'id', description: 'UUID de la escuela', type: 'string' })
  @ApiResponse({ status: 200, description: 'Escuela eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar porque tiene alumnos asociados' })
  remove(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'remove_escuela' }, id);
  }
}
