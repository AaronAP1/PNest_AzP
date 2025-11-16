import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReunionesService } from './reuniones.service';
import { CreateReunionDto, EstadoReunion } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';

@Controller('reuniones')
export class ReunionesController {
  constructor(private readonly reunionesService: ReunionesService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createDto: CreateReunionDto) {
    return this.reunionesService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.reunionesService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.reunionesService.findOne(id);
  }

  @Get('solicitud/:idSolicitud')
  findBySolicitudHttp(@Param('idSolicitud') idSolicitud: string) {
    return this.reunionesService.findBySolicitud(idSolicitud);
  }

  @Get('estado/:estado')
  findByEstadoHttp(@Param('estado') estado: EstadoReunion) {
    return this.reunionesService.findByEstado(estado);
  }

  @Get('count/by-estado')
  countByEstadoHttp() {
    return this.reunionesService.countByEstado();
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateReunionDto) {
    return this.reunionesService.update(id, updateDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.reunionesService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-reunion' })
  create(@Payload() createDto: CreateReunionDto) {
    return this.reunionesService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-reuniones' })
  findAll() {
    return this.reunionesService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-reunion' })
  findOne(@Payload() id: string) {
    return this.reunionesService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-reuniones-by-solicitud' })
  findBySolicitud(@Payload() idSolicitud: string) {
    return this.reunionesService.findBySolicitud(idSolicitud);
  }

  @MessagePattern({ cmd: 'find-reuniones-by-estado' })
  findByEstado(@Payload() estado: EstadoReunion) {
    return this.reunionesService.findByEstado(estado);
  }

  @MessagePattern({ cmd: 'update-reunion' })
  update(@Payload() payload: { id: string; updateDto: UpdateReunionDto }) {
    return this.reunionesService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-reunion' })
  remove(@Payload() id: string) {
    return this.reunionesService.remove(id);
  }

  @MessagePattern({ cmd: 'count-reuniones-by-estado' })
  countByEstado() {
    return this.reunionesService.countByEstado();
  }
}
