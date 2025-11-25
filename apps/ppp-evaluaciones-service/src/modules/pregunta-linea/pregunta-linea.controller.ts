import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PreguntaLineaService } from './pregunta-linea.service';
import { CreatePreguntaLineaDto } from './dto/create-pregunta-linea.dto';
import { UpdatePreguntaLineaDto } from './dto/update-pregunta-linea.dto';

@ApiTags('Pregunta Línea')
@Controller('pregunta-linea')
export class PreguntaLineaController {
  constructor(private readonly preguntaLineaService: PreguntaLineaService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva pregunta por línea' })
  @ApiBody({ type: CreatePreguntaLineaDto })
  @ApiResponse({ status: 201, description: 'Pregunta creada exitosamente' })
  createHttp(@Body() createDto: CreatePreguntaLineaDto) {
    return this.preguntaLineaService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.preguntaLineaService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.preguntaLineaService.findOne(id);
  }

  @Get('linea-facultad/:idLineaFacultad')
  findByLineaFacultadHttp(@Param('idLineaFacultad') idLineaFacultad: string) {
    return this.preguntaLineaService.findByLineaFacultad(idLineaFacultad);
  }

  @Get('evaluacion-practicante/:idEvaluacionPracticante')
  findByEvaluacionPracticanteHttp(@Param('idEvaluacionPracticante') idEvaluacionPracticante: string) {
    return this.preguntaLineaService.findByEvaluacionPracticante(idEvaluacionPracticante);
  }

  @Put(':id')
  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdatePreguntaLineaDto) {
    return this.preguntaLineaService.update(id, updateDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.preguntaLineaService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-pregunta-linea' })
  create(@Payload() createDto: CreatePreguntaLineaDto) {
    return this.preguntaLineaService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-preguntas-linea' })
  findAll() {
    return this.preguntaLineaService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-pregunta-linea' })
  findOne(@Payload() id: string) {
    return this.preguntaLineaService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-preguntas-linea-by-linea-facultad' })
  findByLineaFacultad(@Payload() idLineaFacultad: string) {
    return this.preguntaLineaService.findByLineaFacultad(idLineaFacultad);
  }

  @MessagePattern({ cmd: 'find-preguntas-linea-by-evaluacion-practicante' })
  findByEvaluacionPracticante(@Payload() idEvaluacionPracticante: string) {
    return this.preguntaLineaService.findByEvaluacionPracticante(idEvaluacionPracticante);
  }

  @MessagePattern({ cmd: 'update-pregunta-linea' })
  update(@Payload() payload: { id: string; updateDto: UpdatePreguntaLineaDto }) {
    return this.preguntaLineaService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-pregunta-linea' })
  remove(@Payload() id: string) {
    return this.preguntaLineaService.remove(id);
  }
}
