import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LineasFacultadService } from './lineas-facultad.service';
import { CreateLineaFacultadDto } from './dto/create-linea-facultad.dto';
import { UpdateLineaFacultadDto } from './dto/update-linea-facultad.dto';

@ApiTags('Líneas de Facultad')
@Controller('lineas-facultad')
export class LineasFacultadController {
  constructor(private readonly lineasFacultadService: LineasFacultadService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva línea de práctica/investigación' })
  @ApiBody({ type: CreateLineaFacultadDto })
  @ApiResponse({ status: 201, description: 'Línea creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Escuela no encontrada' })
  @ApiResponse({ status: 409, description: 'El código de línea ya existe' })
  createHttp(@Body() createLineaFacultadDto: CreateLineaFacultadDto) {
    return this.lineasFacultadService.create(createLineaFacultadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las líneas de facultad' })
  @ApiResponse({ status: 200, description: 'Lista de líneas con sus escuelas y facultades' })
  findAllHttp() {
    return this.lineasFacultadService.findAll();
  }

  @Get('escuela/:idEscuela')
  @ApiOperation({ summary: 'Obtener líneas por escuela' })
  @ApiParam({ name: 'idEscuela', description: 'UUID de la escuela' })
  @ApiResponse({ status: 200, description: 'Lista de líneas de la escuela' })
  findByEscuelaHttp(@Param('idEscuela') idEscuela: string) {
    return this.lineasFacultadService.findByEscuela(idEscuela);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una línea por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la línea' })
  @ApiResponse({ status: 200, description: 'Línea encontrada' })
  @ApiResponse({ status: 404, description: 'Línea no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.lineasFacultadService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una línea' })
  @ApiParam({ name: 'id', description: 'UUID de la línea' })
  @ApiResponse({ status: 200, description: 'Línea actualizada' })
  @ApiResponse({ status: 404, description: 'Línea no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateLineaFacultadDto: UpdateLineaFacultadDto) {
    return this.lineasFacultadService.update(id, updateLineaFacultadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una línea' })
  @ApiParam({ name: 'id', description: 'UUID de la línea' })
  @ApiResponse({ status: 204, description: 'Línea eliminada' })
  @ApiResponse({ status: 404, description: 'Línea no encontrada' })
  removeHttp(@Param('id') id: string) {
    return this.lineasFacultadService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern('lineas-facultad.create')
  create(@Payload() createLineaFacultadDto: CreateLineaFacultadDto) {
    return this.lineasFacultadService.create(createLineaFacultadDto);
  }

  @MessagePattern('lineas-facultad.findAll')
  findAll() {
    return this.lineasFacultadService.findAll();
  }

  @MessagePattern('lineas-facultad.findOne')
  findOne(@Payload() id: string) {
    return this.lineasFacultadService.findOne(id);
  }

  @MessagePattern('lineas-facultad.findByEscuela')
  findByEscuela(@Payload() idEscuela: string) {
    return this.lineasFacultadService.findByEscuela(idEscuela);
  }

  @MessagePattern('lineas-facultad.update')
  update(@Payload() payload: { id: string; updateLineaFacultadDto: UpdateLineaFacultadDto }) {
    return this.lineasFacultadService.update(payload.id, payload.updateLineaFacultadDto);
  }

  @MessagePattern('lineas-facultad.remove')
  remove(@Payload() id: string) {
    return this.lineasFacultadService.remove(id);
  }
}
