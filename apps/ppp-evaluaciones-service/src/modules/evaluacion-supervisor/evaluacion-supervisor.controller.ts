import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluacionSupervisorService } from './evaluacion-supervisor.service';
import { CreateEvaluacionSupervisorDto } from './dto/create-evaluacion-supervisor.dto';
import { UpdateEvaluacionSupervisorDto } from './dto/update-evaluacion-supervisor.dto';

@Controller('evaluacion-supervisor')
export class EvaluacionSupervisorController {
  constructor(private readonly evaluacionSupervisorService: EvaluacionSupervisorService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createDto: CreateEvaluacionSupervisorDto) {
    return this.evaluacionSupervisorService.create(createDto);
  }

  @Get()
  findAllHttp() {
    return this.evaluacionSupervisorService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.evaluacionSupervisorService.findOne(id);
  }

  @Get('supervisor/:idSupervisor')
  findBySupervisorHttp(@Param('idSupervisor') idSupervisor: string) {
    return this.evaluacionSupervisorService.findBySupervisor(idSupervisor);
  }

  @Get('alumno/:idAlumno')
  findByAlumnoHttp(@Param('idAlumno') idAlumno: string) {
    return this.evaluacionSupervisorService.findByAlumno(idAlumno);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDto: UpdateEvaluacionSupervisorDto) {
    return this.evaluacionSupervisorService.update(id, updateDto);
  }

  @Delete(':id')
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
