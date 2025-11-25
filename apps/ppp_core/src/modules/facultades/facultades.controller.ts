import { Controller, Get, Post, Body, Patch, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacultadesService } from './facultades.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@ApiTags('Facultades')
@Controller('facultades')
export class FacultadesController {
  constructor(private readonly facultadesService: FacultadesService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva facultad' })
  @ApiBody({ type: CreateFacultadDto })
  @ApiResponse({ status: 201, description: 'Facultad creada exitosamente' })
  @ApiResponse({ status: 409, description: 'El código de facultad ya existe' })
  createHttp(@Body() createFacultadDto: CreateFacultadDto) {
    return this.facultadesService.create(createFacultadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facultades' })
  @ApiResponse({ status: 200, description: 'Lista de facultades con sus escuelas' })
  findAllHttp() {
    return this.facultadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una facultad por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad' })
  @ApiResponse({ status: 200, description: 'Facultad encontrada' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.facultadesService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una facultad' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad' })
  @ApiResponse({ status: 200, description: 'Facultad actualizada' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateFacultadDto: UpdateFacultadDto) {
    return this.facultadesService.update(id, updateFacultadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una facultad' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad' })
  @ApiResponse({ status: 204, description: 'Facultad eliminada' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar, tiene escuelas asociadas' })
  removeHttp(@Param('id') id: string) {
    return this.facultadesService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_facultad' })
  create(@Payload() createFacultadDto: CreateFacultadDto) {
    return this.facultadesService.create(createFacultadDto);
  }

  @MessagePattern({ cmd: 'find_all_facultades' })
  findAll() {
    return this.facultadesService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_facultad' })
  findOne(@Payload() id: string) {
    return this.facultadesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_facultad' })
  update(@Payload() payload: { id: string; data: UpdateFacultadDto }) {
    return this.facultadesService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_facultad' })
  remove(@Payload() id: string) {
    return this.facultadesService.remove(id);
  }
}
