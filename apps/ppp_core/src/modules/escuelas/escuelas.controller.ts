import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EscuelasService } from './escuelas.service';
import { CreateEscuelaDto } from './dto/create-escuela.dto';
import { UpdateEscuelaDto } from './dto/update-escuela.dto';

@ApiTags('Escuelas')
@Controller('escuelas')
export class EscuelasController {
  constructor(private readonly escuelasService: EscuelasService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva escuela profesional' })
  @ApiBody({ type: CreateEscuelaDto })
  @ApiResponse({ status: 201, description: 'Escuela creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 409, description: 'El código de escuela ya existe' })
  createHttp(@Body() createEscuelaDto: CreateEscuelaDto) {
    return this.escuelasService.create(createEscuelaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las escuelas' })
  @ApiResponse({ status: 200, description: 'Lista de escuelas con sus facultades y líneas' })
  findAllHttp() {
    return this.escuelasService.findAll();
  }

  @Get('facultad/:idFacultad')
  @ApiOperation({ summary: 'Obtener escuelas por facultad' })
  @ApiParam({ name: 'idFacultad', description: 'UUID de la facultad' })
  @ApiResponse({ status: 200, description: 'Lista de escuelas de la facultad' })
  findByFacultadHttp(@Param('idFacultad') idFacultad: string) {
    return this.escuelasService.findByFacultad(idFacultad);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una escuela por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la escuela' })
  @ApiResponse({ status: 200, description: 'Escuela encontrada' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.escuelasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una escuela' })
  @ApiParam({ name: 'id', description: 'UUID de la escuela' })
  @ApiResponse({ status: 200, description: 'Escuela actualizada' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateEscuelaDto: UpdateEscuelaDto) {
    return this.escuelasService.update(id, updateEscuelaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una escuela' })
  @ApiParam({ name: 'id', description: 'UUID de la escuela' })
  @ApiResponse({ status: 204, description: 'Escuela eliminada' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar, tiene líneas asociadas' })
  removeHttp(@Param('id') id: string) {
    return this.escuelasService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_escuela' })
  create(@Payload() createEscuelaDto: CreateEscuelaDto) {
    return this.escuelasService.create(createEscuelaDto);
  }

  @MessagePattern({ cmd: 'find_all_escuelas' })
  findAll() {
    return this.escuelasService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_escuela' })
  findOne(@Payload() id: string) {
    return this.escuelasService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_escuelas_by_facultad' })
  findByFacultad(@Payload() idFacultad: string) {
    return this.escuelasService.findByFacultad(idFacultad);
  }

  @MessagePattern({ cmd: 'update_escuela' })
  update(@Payload() payload: { id: string; data: UpdateEscuelaDto }) {
    return this.escuelasService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_escuela' })
  remove(@Payload() id: string) {
    return this.escuelasService.remove(id);
  }
}
