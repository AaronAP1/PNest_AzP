import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SolicitudesPppService } from './solicitudes-ppp.service';
import { CreateSolicitudPppDto } from './dto/create-solicitud-ppp.dto';
import { UpdateSolicitudPppDto } from './dto/update-solicitud-ppp.dto';

@Controller('solicitudes-ppp')
export class SolicitudesPppController {
  constructor(private readonly solicitudesPppService: SolicitudesPppService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createDto: CreateSolicitudPppDto) {
    return this.solicitudesPppService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.solicitudesPppService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.solicitudesPppService.findOne(id);
  }

  @Get('alumno/:idAlumno')
  findByAlumnoHttp(@Param('idAlumno') idAlumno: string) {
    return this.solicitudesPppService.findByAlumno(idAlumno);
  }

  @Get('supervisor/:idSupervisor')
  findBySupervisorHttp(@Param('idSupervisor') idSupervisor: string) {
    return this.solicitudesPppService.findBySupervisor(idSupervisor);
  }

  @Get('estado/:estado')
  findByEstadoHttp(@Param('estado') estado: string) {
    return this.solicitudesPppService.findByEstado(estado);
  }

  @Get('count/by-estado')
  countByEstadoHttp() {
    return this.solicitudesPppService.countByEstado();
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateSolicitudPppDto) {
    return this.solicitudesPppService.update(id, updateDto);
  }

  @Delete(':id')
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
