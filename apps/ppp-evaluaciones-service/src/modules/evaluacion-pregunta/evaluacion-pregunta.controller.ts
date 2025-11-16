import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluacionPreguntaService } from './evaluacion-pregunta.service';
import { CreateEvaluacionPreguntaDto } from './dto/create-evaluacion-pregunta.dto';
import { UpdateEvaluacionPreguntaDto } from './dto/update-evaluacion-pregunta.dto';

@Controller('evaluacion-pregunta')
export class EvaluacionPreguntaController {
  constructor(private readonly evaluacionPreguntaService: EvaluacionPreguntaService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createDto: CreateEvaluacionPreguntaDto) {
    return this.evaluacionPreguntaService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.evaluacionPreguntaService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.evaluacionPreguntaService.findOne(id);
  }

  @Get('evaluacion/:idEvaluacion')
  findByEvaluacionHttp(@Param('idEvaluacion') idEvaluacion: string) {
    return this.evaluacionPreguntaService.findByEvaluacion(idEvaluacion);
  }

  @Get('pregunta/:idPregunta')
  findByPreguntaHttp(@Param('idPregunta') idPregunta: string) {
    return this.evaluacionPreguntaService.findByPregunta(idPregunta);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateEvaluacionPreguntaDto) {
    return this.evaluacionPreguntaService.update(id, updateDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.evaluacionPreguntaService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-evaluacion-pregunta' })
  create(@Payload() createDto: CreateEvaluacionPreguntaDto) {
    return this.evaluacionPreguntaService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-evaluaciones-pregunta' })
  findAll() {
    return this.evaluacionPreguntaService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-evaluacion-pregunta' })
  findOne(@Payload() id: string) {
    return this.evaluacionPreguntaService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-pregunta-by-evaluacion' })
  findByEvaluacion(@Payload() idEvaluacion: string) {
    return this.evaluacionPreguntaService.findByEvaluacion(idEvaluacion);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-pregunta-by-pregunta' })
  findByPregunta(@Payload() idPregunta: string) {
    return this.evaluacionPreguntaService.findByPregunta(idPregunta);
  }

  @MessagePattern({ cmd: 'update-evaluacion-pregunta' })
  update(@Payload() payload: { id: string; updateDto: UpdateEvaluacionPreguntaDto }) {
    return this.evaluacionPreguntaService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-evaluacion-pregunta' })
  remove(@Payload() id: string) {
    return this.evaluacionPreguntaService.remove(id);
  }
}
