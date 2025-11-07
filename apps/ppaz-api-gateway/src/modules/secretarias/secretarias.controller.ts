import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';

@ApiTags('secretarias')
@Controller('secretarias')
export class SecretariasController {
  constructor(
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva secretaria', description: 'Registra una secretaria asociada a una escuela' })
  @ApiBody({ type: CreateSecretariaDto })
  @ApiResponse({ status: 201, description: 'Secretaria creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o escuela no existe' })
  create(@Body() createSecretariaDto: CreateSecretariaDto): Observable<any> {
    return this.coreClient.send({ cmd: 'create_secretaria' }, createSecretariaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las secretarias', description: 'Obtiene todas las secretarias con información de su escuela y facultad' })
  @ApiResponse({ status: 200, description: 'Lista de secretarias obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.coreClient.send({ cmd: 'find_all_secretarias' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener secretaria por ID', description: 'Busca una secretaria específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la secretaria', type: 'string' })
  @ApiResponse({ status: 200, description: 'Secretaria encontrada' })
  @ApiResponse({ status: 404, description: 'Secretaria no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_one_secretaria' }, id);
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Listar secretarias por escuela', description: 'Obtiene todas las secretarias de una escuela específica' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de secretarias obtenida' })
  findByEscuela(@Param('idEscuela') idEscuela: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_secretarias_by_escuela' }, idEscuela);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar secretaria', description: 'Actualiza los datos de una secretaria existente' })
  @ApiParam({ name: 'id', description: 'UUID de la secretaria', type: 'string' })
  @ApiBody({ type: UpdateSecretariaDto })
  @ApiResponse({ status: 200, description: 'Secretaria actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Secretaria no encontrada' })
  update(@Param('id') id: string, @Body() updateSecretariaDto: UpdateSecretariaDto): Observable<any> {
    return this.coreClient.send({ cmd: 'update_secretaria' }, { id, updateSecretariaDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar secretaria', description: 'Elimina una secretaria del sistema' })
  @ApiParam({ name: 'id', description: 'UUID de la secretaria', type: 'string' })
  @ApiResponse({ status: 200, description: 'Secretaria eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Secretaria no encontrada' })
  remove(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'remove_secretaria' }, id);
  }
}
