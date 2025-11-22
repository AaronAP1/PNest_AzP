import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { DimensionTransversalService } from './dimension-transversal.service';
import { CreateDimensionTransversalDto } from './dto/create-dimension-transversal.dto';
import { UpdateDimensionTransversalDto } from './dto/update-dimension-transversal.dto';

@ApiTags('dimension-transversal')
@Controller('dimension-transversal')
export class DimensionTransversalController {
  constructor(private readonly dimensionTransversalService: DimensionTransversalService) {}

  // ========== REST ENDPOINTS ==========
  @Post()
  @ApiOperation({ summary: 'Crear una nueva dimensión transversal' })
  @ApiBody({ type: CreateDimensionTransversalDto })
  @ApiResponse({ status: 201, description: 'Dimensión transversal creada exitosamente' })
  createRest(@Body() createDto: CreateDimensionTransversalDto) {
    return this.dimensionTransversalService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las dimensiones transversales' })
  @ApiResponse({ status: 200, description: 'Lista de dimensiones transversales obtenida exitosamente' })
  findAllRest() {
    return this.dimensionTransversalService.findAll();
  }

  @Get('activas')
  @ApiOperation({ summary: 'Listar dimensiones transversales activas' })
  @ApiResponse({ status: 200, description: 'Lista de dimensiones transversales activas' })
  findAllActivasRest() {
    return this.dimensionTransversalService.findAllActivas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener dimensión transversal por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la dimensión transversal' })
  @ApiResponse({ status: 200, description: 'Dimensión transversal encontrada' })
  @ApiResponse({ status: 404, description: 'Dimensión transversal no encontrada' })
  findOneRest(@Param('id') id: string) {
    return this.dimensionTransversalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar dimensión transversal' })
  @ApiParam({ name: 'id', description: 'UUID de la dimensión transversal' })
  @ApiResponse({ status: 200, description: 'Dimensión transversal actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Dimensión transversal no encontrada' })
  updateRest(@Param('id') id: string, @Body() updateDto: UpdateDimensionTransversalDto) {
    return this.dimensionTransversalService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar dimensión transversal' })
  @ApiParam({ name: 'id', description: 'UUID de la dimensión transversal' })
  @ApiResponse({ status: 200, description: 'Dimensión transversal eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Dimensión transversal no encontrada' })
  removeRest(@Param('id') id: string) {
    return this.dimensionTransversalService.remove(id);
  }

  // ========== TCP MICROSERVICE PATTERNS ==========
  @MessagePattern({ cmd: 'create-dimension-transversal' })
  create(@Payload() createDto: CreateDimensionTransversalDto) {
    return this.dimensionTransversalService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-dimensiones-transversales' })
  findAll() {
    return this.dimensionTransversalService.findAll();
  }

  @MessagePattern({ cmd: 'find-dimensiones-transversales-activas' })
  findAllActivas() {
    return this.dimensionTransversalService.findAllActivas();
  }

  @MessagePattern({ cmd: 'find-one-dimension-transversal' })
  findOne(@Payload() id: string) {
    return this.dimensionTransversalService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-dimension-transversal' })
  update(@Payload() payload: { id: string; updateDto: UpdateDimensionTransversalDto }) {
    return this.dimensionTransversalService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-dimension-transversal' })
  remove(@Payload() id: string) {
    return this.dimensionTransversalService.remove(id);
  }
}
