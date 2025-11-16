import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluacionPracticanteService } from './evaluacion-practicante.service';
import { CreateEvaluacionPracticanteDto } from './dto/create-evaluacion-practicante.dto';
import { UpdateEvaluacionPracticanteDto } from './dto/update-evaluacion-practicante.dto';

@Controller('evaluacion-practicante')
export class EvaluacionPracticanteController {
  constructor(private readonly evaluacionPracticanteService: EvaluacionPracticanteService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createDto: CreateEvaluacionPracticanteDto) {
    return this.evaluacionPracticanteService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.evaluacionPracticanteService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.evaluacionPracticanteService.findOne(id);
  }

  @Get('solicitud/:idSolicitud')
  findBySolicitudHttp(@Param('idSolicitud') idSolicitud: string) {
    return this.evaluacionPracticanteService.findBySolicitud(idSolicitud);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateEvaluacionPracticanteDto) {
    return this.evaluacionPracticanteService.update(id, updateDto);
  }

  @Delete(':id')
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
