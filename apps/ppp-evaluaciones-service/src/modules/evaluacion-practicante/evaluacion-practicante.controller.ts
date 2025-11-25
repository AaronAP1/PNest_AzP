import { Controller, Get, Post, Body, Patch, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluacionPracticanteService } from './evaluacion-practicante.service';
import { CreateEvaluacionPracticanteDto } from './dto/create-evaluacion-practicante.dto';
import { UpdateEvaluacionPracticanteDto } from './dto/update-evaluacion-practicante.dto';

@ApiTags('Evaluación Practicante')
@Controller('evaluacion-practicante')
export class EvaluacionPracticanteController {
  constructor(private readonly evaluacionPracticanteService: EvaluacionPracticanteService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva evaluación de practicante' })
  @ApiBody({ type: CreateEvaluacionPracticanteDto })
  @ApiResponse({ status: 201, description: 'Evaluación creada exitosamente' })
  createHttp(@Body() createDto: CreateEvaluacionPracticanteDto) {
    return this.evaluacionPracticanteService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las evaluaciones de practicantes' })
  @ApiResponse({ status: 200, description: 'Lista de evaluaciones con preguntas por línea' })
  findAllHttp() {
    return this.evaluacionPracticanteService.findAll();
  }

  @Get('solicitud/:idSolicitud')
  @ApiOperation({ summary: 'Obtener evaluaciones por solicitud de PPP' })
  @ApiParam({ name: 'idSolicitud', description: 'UUID de la solicitud (referencia a ppp_companias.solicitud_ppp)' })
  @ApiResponse({ status: 200, description: 'Lista de evaluaciones de la solicitud' })
  findBySolicitudHttp(@Param('idSolicitud') idSolicitud: string) {
    return this.evaluacionPracticanteService.findBySolicitud(idSolicitud);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una evaluación por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  @ApiResponse({ status: 200, description: 'Evaluación encontrada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.evaluacionPracticanteService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una evaluación' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  @ApiResponse({ status: 200, description: 'Evaluación actualizada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateEvaluacionPracticanteDto) {
    return this.evaluacionPracticanteService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una evaluación' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  @ApiResponse({ status: 204, description: 'Evaluación eliminada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  removeHttp(@Param('id') id: string) {
    return this.evaluacionPracticanteService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-evaluacion-practicante' })
  create(@Payload() createDto: CreateEvaluacionPracticanteDto) {
    return this.evaluacionPracticanteService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-evaluaciones-practicante' })
  findAll() {
    return this.evaluacionPracticanteService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-evaluacion-practicante' })
  findOne(@Payload() id: string) {
    return this.evaluacionPracticanteService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-practicante-by-solicitud' })
  findBySolicitud(@Payload() idSolicitud: string) {
    return this.evaluacionPracticanteService.findBySolicitud(idSolicitud);
  }

  @MessagePattern({ cmd: 'update-evaluacion-practicante' })
  update(@Payload() payload: { id: string; updateDto: UpdateEvaluacionPracticanteDto }) {
    return this.evaluacionPracticanteService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-evaluacion-practicante' })
  remove(@Payload() id: string) {
    return this.evaluacionPracticanteService.remove(id);
  }
}
