import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupervisoresService } from './supervisores.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@Controller('supervisores')
export class SupervisoresController {
  constructor(private readonly supervisoresService: SupervisoresService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createSupervisorDto: CreateSupervisorDto) {
    return this.supervisoresService.create(createSupervisorDto);
  }

  @Get()
  findAllHttp() {
    return this.supervisoresService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.supervisoresService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  findByUsuarioHttp(@Param('usuarioId') usuarioId: string) {
    return this.supervisoresService.findByUsuarioId(usuarioId);
  }

  @Get('escuela/:idEscuela')
  findByEscuelaHttp(@Param('idEscuela') idEscuela: string) {
    return this.supervisoresService.findByEscuela(idEscuela);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateSupervisorDto: UpdateSupervisorDto) {
    return this.supervisoresService.update(id, updateSupervisorDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.supervisoresService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern('supervisores.create')
  create(@Payload() createSupervisorDto: CreateSupervisorDto) {
    return this.supervisoresService.create(createSupervisorDto);
  }

  @MessagePattern('supervisores.findAll')
  findAll() {
    return this.supervisoresService.findAll();
  }

  @MessagePattern('supervisores.findOne')
  findOne(@Payload() id: string) {
    return this.supervisoresService.findOne(id);
  }

  @MessagePattern('supervisores.findByUsuarioId')
  findByUsuarioId(@Payload() usuarioId: string) {
    return this.supervisoresService.findByUsuarioId(usuarioId);
  }

  @MessagePattern('supervisores.findByEscuela')
  findByEscuela(@Payload() idEscuela: string) {
    return this.supervisoresService.findByEscuela(idEscuela);
  }

  @MessagePattern('supervisores.update')
  update(@Payload() payload: { id: string; updateSupervisorDto: UpdateSupervisorDto }) {
    return this.supervisoresService.update(payload.id, payload.updateSupervisorDto);
  }

  @MessagePattern('supervisores.remove')
  remove(@Payload() id: string) {
    return this.supervisoresService.remove(id);
  }
}
