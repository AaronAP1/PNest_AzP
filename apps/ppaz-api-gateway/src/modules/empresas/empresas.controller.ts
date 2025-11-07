import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@ApiTags('empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(
    @Inject('PPP_COMPANIAS_SERVICE') private readonly companiasClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva empresa', description: 'Registra una nueva empresa para prácticas profesionales' })
  @ApiBody({ type: CreateEmpresaDto })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe una empresa con ese RUC' })
  create(@Body() createEmpresaDto: CreateEmpresaDto): Observable<any> {
    return this.companiasClient.send({ cmd: 'create_empresa' }, createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas', description: 'Obtiene la lista completa de empresas registradas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_all_empresas' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empresa por ID', description: 'Busca una empresa específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa', type: 'string' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_one_empresa' }, id);
  }

  @Get('ruc/:ruc')
  @ApiOperation({ summary: 'Buscar empresa por RUC', description: 'Busca una empresa usando su número de RUC' })
  @ApiParam({ name: 'ruc', description: 'RUC de la empresa (11 dígitos)', type: 'string', example: '20123456789' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findByRuc(@Param('ruc') ruc: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_empresa_by_ruc' }, ruc);
  }

  @Get('sector/:sector')
  @ApiOperation({ summary: 'Buscar empresas por sector', description: 'Obtiene empresas de un sector económico específico' })
  @ApiParam({ name: 'sector', description: 'Sector económico', type: 'string', example: 'Tecnología' })
  @ApiResponse({ status: 200, description: 'Lista de empresas obtenida' })
  findBySector(@Param('sector') sector: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_empresas_by_sector' }, sector);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar empresa', description: 'Actualiza los datos de una empresa existente' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa', type: 'string' })
  @ApiBody({ type: UpdateEmpresaDto })
  @ApiResponse({ status: 200, description: 'Empresa actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto): Observable<any> {
    return this.companiasClient.send({ cmd: 'update_empresa' }, { id, updateEmpresaDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar empresa', description: 'Elimina una empresa (solo si no tiene cartas de presentación asociadas)' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa', type: 'string' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar porque tiene cartas asociadas' })
  remove(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'remove_empresa' }, id);
  }
}
