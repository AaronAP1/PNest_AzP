import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EvaluacionPracticanteSolicitudService } from './evaluacion-practicante-solicitud.service';
import { CreateEvaluacionPracticanteSolicitudDto } from './dto/create-evaluacion-practicante-solicitud.dto';
import { UpdateEvaluacionPracticanteSolicitudDto } from './dto/update-evaluacion-practicante-solicitud.dto';

@ApiTags('Evaluación Practicante Solicitud')
@Controller('evaluacion-practicante-solicitud')
export class EvaluacionPracticanteSolicitudController {
  constructor(private readonly evaluacionPracticanteSolicitudService: EvaluacionPracticanteSolicitudService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva evaluación practicante solicitud' })
  @ApiBody({ type: CreateEvaluacionPracticanteSolicitudDto })
  @ApiResponse({ status: 201, description: 'Evaluación creada exitosamente' })
  createHttp(@Body() createDto: CreateEvaluacionPracticanteSolicitudDto) {
    return this.evaluacionPracticanteSolicitudService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.evaluacionPracticanteSolicitudService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.evaluacionPracticanteSolicitudService.findOne(id);
  }

  @Get('dimension-transversal/:idDimensionTransversal')
  findByDimensionTransversalHttp(@Param('idDimensionTransversal') idDimensionTransversal: string) {
    return this.evaluacionPracticanteSolicitudService.findByDimensionTransversal(idDimensionTransversal);
  }

  @Get('evaluacion-practicante/:idEvaluacionPracticante')
  findByEvaluacionPracticanteHttp(@Param('idEvaluacionPracticante') idEvaluacionPracticante: string) {
    return this.evaluacionPracticanteSolicitudService.findByEvaluacionPracticante(idEvaluacionPracticante);
  }

  @Put(':id')
  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateEvaluacionPracticanteSolicitudDto) {
    return this.evaluacionPracticanteSolicitudService.update(id, updateDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.evaluacionPracticanteSolicitudService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create-evaluacion-practicante-solicitud' })
  create(@Payload() createDto: CreateEvaluacionPracticanteSolicitudDto) {
    return this.evaluacionPracticanteSolicitudService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-evaluaciones-practicante-solicitud' })
  findAll() {
    return this.evaluacionPracticanteSolicitudService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-evaluacion-practicante-solicitud' })
  findOne(@Payload() id: string) {
    return this.evaluacionPracticanteSolicitudService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-by-dimension-transversal' })
  findByDimensionTransversal(@Payload() idDimensionTransversal: string) {
    return this.evaluacionPracticanteSolicitudService.findByDimensionTransversal(idDimensionTransversal);
  }

  @MessagePattern({ cmd: 'find-evaluaciones-by-evaluacion-practicante' })
  findByEvaluacionPracticante(@Payload() idEvaluacionPracticante: string) {
    return this.evaluacionPracticanteSolicitudService.findByEvaluacionPracticante(idEvaluacionPracticante);
  }

  @MessagePattern({ cmd: 'update-evaluacion-practicante-solicitud' })
  update(@Payload() payload: { id: string; updateDto: UpdateEvaluacionPracticanteSolicitudDto }) {
    return this.evaluacionPracticanteSolicitudService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-evaluacion-practicante-solicitud' })
  remove(@Payload() id: string) {
    return this.evaluacionPracticanteSolicitudService.remove(id);
  }
}
