import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto';

@ApiTags('Empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  @ApiResponse({ status: 409, description: 'El RUC ya está registrado' })
  createHttp(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas registradas' })
  findAllHttp() {
    return this.empresasService.findAll();
  }

  @Get('ruc/:ruc')
  @ApiOperation({ summary: 'Buscar empresa por RUC' })
  @ApiParam({ name: 'ruc', description: 'RUC de la empresa (11 dígitos)' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findByRucHttp(@Param('ruc') ruc: string) {
    return this.empresasService.findByRuc(ruc);
  }

  @Get('sector/:sector')
  @ApiOperation({ summary: 'Buscar empresas por sector económico' })
  @ApiParam({ name: 'sector', description: 'Sector económico' })
  @ApiResponse({ status: 200, description: 'Lista de empresas del sector' })
  findBySectorHttp(@Param('sector') sector: string) {
    return this.empresasService.findBySector(sector);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una empresa' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una empresa' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiResponse({ status: 204, description: 'Empresa eliminada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar, tiene solicitudes asociadas' })
  removeHttp(@Param('id') id: string) {
    return this.empresasService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_empresa' })
  create(@Payload() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @MessagePattern({ cmd: 'find_all_empresas' })
  findAll() {
    return this.empresasService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_empresa' })
  findOne(@Payload() id: string) {
    return this.empresasService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_empresa_by_ruc' })
  findByRuc(@Payload() ruc: string) {
    return this.empresasService.findByRuc(ruc);
  }

  @MessagePattern({ cmd: 'find_empresas_by_sector' })
  findBySector(@Payload() sector: string) {
    return this.empresasService.findBySector(sector);
  }

  @MessagePattern({ cmd: 'update_empresa' })
  update(@Payload() payload: { id: string; updateEmpresaDto: UpdateEmpresaDto }) {
    return this.empresasService.update(payload.id, payload.updateEmpresaDto);
  }

  @MessagePattern({ cmd: 'remove_empresa' })
  remove(@Payload() id: string) {
    return this.empresasService.remove(id);
  }
}
