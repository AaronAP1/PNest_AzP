import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@ApiTags('facultades')
@Controller('facultades')
export class FacultadesController {
  constructor(
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva facultad', description: 'Registra una nueva facultad en el sistema' })
  @ApiBody({ type: CreateFacultadDto })
  @ApiResponse({ status: 201, description: 'Facultad creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una facultad con ese código' })
  create(@Body() createFacultadDto: CreateFacultadDto): Observable<any> {
    return this.coreClient.send({ cmd: 'create_facultad' }, createFacultadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las facultades', description: 'Obtiene la lista completa de facultades con el conteo de escuelas' })
  @ApiResponse({ status: 200, description: 'Lista de facultades obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.coreClient.send({ cmd: 'find_all_facultades' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener facultad por ID', description: 'Busca una facultad específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Facultad encontrada' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_one_facultad' }, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar facultad', description: 'Actualiza los datos de una facultad existente' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad', type: 'string' })
  @ApiBody({ type: UpdateFacultadDto })
  @ApiResponse({ status: 200, description: 'Facultad actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una facultad con ese código' })
  update(@Param('id') id: string, @Body() updateFacultadDto: UpdateFacultadDto): Observable<any> {
    return this.coreClient.send({ cmd: 'update_facultad' }, { id, updateFacultadDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar facultad', description: 'Elimina una facultad del sistema (solo si no tiene escuelas asociadas)' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad', type: 'string' })
  @ApiResponse({ status: 200, description: 'Facultad eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar la facultad porque tiene escuelas asociadas' })
  remove(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'remove_facultad' }, id);
  }
}
