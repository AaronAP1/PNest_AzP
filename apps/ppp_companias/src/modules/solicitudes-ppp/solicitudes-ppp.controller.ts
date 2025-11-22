import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SolicitudesPppService } from './solicitudes-ppp.service';
import { CreateSolicitudPppDto } from './dto/create-solicitud-ppp.dto';
import { UpdateSolicitudPppDto } from './dto/update-solicitud-ppp.dto';

@ApiTags('Solicitudes PPP')
@Controller('solicitudes-ppp')
export class SolicitudesPppController {
  constructor(private readonly solicitudesPppService: SolicitudesPppService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud de PPP' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una solicitud con estos datos' })
  createHttp(@Body() createDto: CreateSolicitudPppDto) {
    return this.solicitudesPppService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de PPP' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes con empresa, cartas, reuniones y documentos' })
  findAllHttp() {
    return this.solicitudesPppService.findAll();
  }

  @Get('alumno/:idAlumno')
  @ApiOperation({ summary: 'Obtener solicitudes por alumno' })
  @ApiParam({ name: 'idAlumno', description: 'UUID del alumno (referencia a ppp_auth.alumnos)' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes del alumno' })
  findByAlumnoHttp(@Param('idAlumno') idAlumno: string) {
    return this.solicitudesPppService.findByAlumno(idAlumno);
  }

  @Get('supervisor/:idSupervisor')
  @ApiOperation({ summary: 'Obtener solicitudes por supervisor' })
  @ApiParam({ name: 'idSupervisor', description: 'UUID del supervisor (referencia a ppp_auth.supervisores)' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes del supervisor' })
  findBySupervisorHttp(@Param('idSupervisor') idSupervisor: string) {
    return this.solicitudesPppService.findBySupervisor(idSupervisor);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener solicitudes por estado' })
  @ApiParam({ name: 'estado', description: 'Estado de la solicitud (pendiente, en_proceso, aprobado, rechazado, cancelado)' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes con el estado especificado' })
  findByEstadoHttp(@Param('estado') estado: string) {
    return this.solicitudesPppService.findByEstado(estado);
  }

  @Get('count/by-estado')
  @ApiOperation({ summary: 'Obtener conteo de solicitudes por estado' })
  @ApiResponse({ status: 200, description: 'Resumen estadístico de solicitudes por estado' })
  countByEstadoHttp() {
    return this.solicitudesPppService.countByEstado();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.solicitudesPppService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una solicitud' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud actualizada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateSolicitudPppDto) {
    return this.solicitudesPppService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una solicitud' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 204, description: 'Solicitud eliminada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  removeHttp(@Param('id') id: string) {
    return this.solicitudesPppService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-solicitud-ppp' })
  create(@Payload() createDto: CreateSolicitudPppDto) {
    return this.solicitudesPppService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-solicitudes-ppp' })
  findAll() {
    return this.solicitudesPppService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-solicitud-ppp' })
  findOne(@Payload() id: string) {
    return this.solicitudesPppService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-solicitudes-by-alumno' })
  findByAlumno(@Payload() idAlumno: string) {
    return this.solicitudesPppService.findByAlumno(idAlumno);
  }

  @MessagePattern({ cmd: 'find-solicitudes-by-supervisor' })
  findBySupervisor(@Payload() idSupervisor: string) {
    return this.solicitudesPppService.findBySupervisor(idSupervisor);
  }

  @MessagePattern({ cmd: 'find-solicitudes-by-estado' })
  findByEstado(@Payload() estado: string) {
    return this.solicitudesPppService.findByEstado(estado);
  }

  @MessagePattern({ cmd: 'update-solicitud-ppp' })
  update(@Payload() payload: { id: string; updateDto: UpdateSolicitudPppDto }) {
    return this.solicitudesPppService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-solicitud-ppp' })
  remove(@Payload() id: string) {
    return this.solicitudesPppService.remove(id);
  }

  @MessagePattern({ cmd: 'count-solicitudes-by-estado' })
  countByEstado() {
    return this.solicitudesPppService.countByEstado();
  }
}
