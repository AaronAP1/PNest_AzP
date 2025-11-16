import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoordinadoresService } from './coordinadores.service';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';

@Controller('coordinadores')
export class CoordinadoresController {
  constructor(private readonly coordinadoresService: CoordinadoresService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createCoordinadorDto: CreateCoordinadorDto) {
    return this.coordinadoresService.create(createCoordinadorDto);
  }

  @Get()
  findAllHttp() {
    return this.coordinadoresService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.coordinadoresService.findOne(id);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateCoordinadorDto: UpdateCoordinadorDto) {
    return this.coordinadoresService.update(id, updateCoordinadorDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.coordinadoresService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern('coordinadores.create')
  create(@Payload() createCoordinadorDto: CreateCoordinadorDto) {
    return this.coordinadoresService.create(createCoordinadorDto);
  }

  @MessagePattern('coordinadores.findAll')
  findAll() {
    return this.coordinadoresService.findAll();
  }

  @MessagePattern('coordinadores.findOne')
  findOne(@Payload() id: string) {
    return this.coordinadoresService.findOne(id);
  }

  @MessagePattern('coordinadores.update')
  update(@Payload() payload: { id: string; updateCoordinadorDto: UpdateCoordinadorDto }) {
    return this.coordinadoresService.update(payload.id, payload.updateCoordinadorDto);
  }

  @MessagePattern('coordinadores.remove')
  remove(@Payload() id: string) {
    return this.coordinadoresService.remove(id);
  }
}
