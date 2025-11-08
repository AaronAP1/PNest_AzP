import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EscuelasService } from './escuelas.service';
import { CreateEscuelaDto } from './dto/create-escuela.dto';
import { UpdateEscuelaDto } from './dto/update-escuela.dto';

@Controller('escuelas')
export class EscuelasController {
  constructor(private readonly escuelasService: EscuelasService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createEscuelaDto: CreateEscuelaDto) {
    return this.escuelasService.create(createEscuelaDto);
  }

  @Get()
  findAllHttp() {
    return this.escuelasService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.escuelasService.findOne(id);
  }

  @Get('facultad/:idFacultad')
  findByFacultadHttp(@Param('idFacultad') idFacultad: string) {
    return this.escuelasService.findByFacultad(idFacultad);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateEscuelaDto: UpdateEscuelaDto) {
    return this.escuelasService.update(id, updateEscuelaDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.escuelasService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_escuela' })
  create(@Payload() createEscuelaDto: CreateEscuelaDto) {
    return this.escuelasService.create(createEscuelaDto);
  }

  @MessagePattern({ cmd: 'find_all_escuelas' })
  findAll() {
    return this.escuelasService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_escuela' })
  findOne(@Payload() id: string) {
    return this.escuelasService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_escuelas_by_facultad' })
  findByFacultad(@Payload() idFacultad: string) {
    return this.escuelasService.findByFacultad(idFacultad);
  }

  @MessagePattern({ cmd: 'update_escuela' })
  update(@Payload() payload: { id: string; data: UpdateEscuelaDto }) {
    return this.escuelasService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_escuela' })
  remove(@Payload() id: string) {
    return this.escuelasService.remove(id);
  }
}
