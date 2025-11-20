import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluacionSupervisorService } from './evaluacion-supervisor.service';
import { CreateEvaluacionSupervisorDto } from './dto/create-evaluacion-supervisor.dto';
import { UpdateEvaluacionSupervisorDto } from './dto/update-evaluacion-supervisor.dto';

@ApiTags('Evaluación Supervisor')
@Controller('evaluacion-supervisor')
export class EvaluacionSupervisorController {
  constructor(private readonly evaluacionSupervisorService: EvaluacionSupervisorService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva evaluación de supervisor' })
  @ApiResponse({ status: 201, description: 'Evaluación creada exitosamente' })
  createHttp(@Body() createDto: CreateEvaluacionSupervisorDto) {
    return this.evaluacionSupervisorService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las evaluaciones de supervisor' })
  @ApiResponse({ status: 200, description: 'Lista de evaluaciones con preguntas' })
  findAllHttp() {
    return this.evaluacionSupervisorService.findAll();
  }

  @Get('supervisor/:idSupervisor')
  @ApiOperation({ summary: 'Obtener evaluaciones por supervisor' })
  @ApiParam({ name: 'idSupervisor', description: 'UUID del supervisor (referencia a ppp_auth.supervisores)' })
  @ApiResponse({ status: 200, description: 'Lista de evaluaciones del supervisor' })
  findBySupervisorHttp(@Param('idSupervisor') idSupervisor: string) {
    return this.evaluacionSupervisorService.findBySupervisor(idSupervisor);
  }

  @Get('alumno/:idAlumno')
  @ApiOperation({ summary: 'Obtener evaluaciones por alumno' })
  @ApiParam({ name: 'idAlumno', description: 'UUID del alumno (referencia a ppp_auth.alumnos)' })
  @ApiResponse({ status: 200, description: 'Lista de evaluaciones del alumno' })
  findByAlumnoHttp(@Param('idAlumno') idAlumno: string) {
    return this.evaluacionSupervisorService.findByAlumno(idAlumno);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una evaluación por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  @ApiResponse({ status: 200, description: 'Evaluación encontrada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.evaluacionSupervisorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una evaluación' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  @ApiResponse({ status: 200, description: 'Evaluación actualizada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateEvaluacionSupervisorDto) {
    return this.evaluacionSupervisorService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una evaluación' })
  @ApiParam({ name: 'id', description: 'UUID de la evaluación' })
  @ApiResponse({ status: 204, description: 'Evaluación eliminada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  removeHttp(@Param('id') id: string) {
    return this.evaluacionSupervisorService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-evaluacion-supervisor' })
  create(@Payload() createDto: CreateEvaluacionSupervisorDto) {
    return this.evaluacionSupervisorService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-evaluaciones-supervisor' })
  findAll() {
    return this.evaluacionSupervisorService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-evaluacion-supervisor' })
  findOne(@Payload() id: string) {
    return this.evaluacionSupervisorService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-by-supervisor' })
  findBySupervisor(@Payload() idSupervisor: string) {
    return this.evaluacionSupervisorService.findBySupervisor(idSupervisor);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-by-alumno' })
  findByAlumno(@Payload() idAlumno: string) {
    return this.evaluacionSupervisorService.findByAlumno(idAlumno);
  }

  @MessagePattern({ cmd: 'update-evaluacion-supervisor' })
  update(@Payload() payload: { id: string; updateDto: UpdateEvaluacionSupervisorDto }) {
    return this.evaluacionSupervisorService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-evaluacion-supervisor' })
  remove(@Payload() id: string) {
    return this.evaluacionSupervisorService.remove(id);
  }
}
