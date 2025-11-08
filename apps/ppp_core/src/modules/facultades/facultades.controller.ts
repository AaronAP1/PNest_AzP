import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacultadesService } from './facultades.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Controller('facultades')
export class FacultadesController {
  constructor(private readonly facultadesService: FacultadesService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createFacultadDto: CreateFacultadDto) {
    return this.facultadesService.create(createFacultadDto);
  }

  @Get()
  findAllHttp() {
    return this.facultadesService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.facultadesService.findOne(id);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateFacultadDto: UpdateFacultadDto) {
    return this.facultadesService.update(id, updateFacultadDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.facultadesService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_facultad' })
  create(@Payload() createFacultadDto: CreateFacultadDto) {
    return this.facultadesService.create(createFacultadDto);
  }

  @MessagePattern({ cmd: 'find_all_facultades' })
  findAll() {
    return this.facultadesService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_facultad' })
  findOne(@Payload() id: string) {
    return this.facultadesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_facultad' })
  update(@Payload() payload: { id: string; data: UpdateFacultadDto }) {
    return this.facultadesService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_facultad' })
  remove(@Payload() id: string) {
    return this.facultadesService.remove(id);
  }
}
