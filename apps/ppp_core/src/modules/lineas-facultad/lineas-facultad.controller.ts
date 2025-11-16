import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LineasFacultadService } from './lineas-facultad.service';
import { CreateLineaFacultadDto } from './dto/create-linea-facultad.dto';
import { UpdateLineaFacultadDto } from './dto/update-linea-facultad.dto';

@Controller('lineas-facultad')
export class LineasFacultadController {
  constructor(private readonly lineasFacultadService: LineasFacultadService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createLineaFacultadDto: CreateLineaFacultadDto) {
    return this.lineasFacultadService.create(createLineaFacultadDto);
  }

  @Get()
  findAllHttp() {
    return this.lineasFacultadService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.lineasFacultadService.findOne(id);
  }

  @Get('escuela/:idEscuela')
  findByEscuelaHttp(@Param('idEscuela') idEscuela: string) {
    return this.lineasFacultadService.findByEscuela(idEscuela);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateLineaFacultadDto: UpdateLineaFacultadDto) {
    return this.lineasFacultadService.update(id, updateLineaFacultadDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.lineasFacultadService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern('lineas-facultad.create')
  create(@Payload() createLineaFacultadDto: CreateLineaFacultadDto) {
    return this.lineasFacultadService.create(createLineaFacultadDto);
  }

  @MessagePattern('lineas-facultad.findAll')
  findAll() {
    return this.lineasFacultadService.findAll();
  }

  @MessagePattern('lineas-facultad.findOne')
  findOne(@Payload() id: string) {
    return this.lineasFacultadService.findOne(id);
  }

  @MessagePattern('lineas-facultad.findByEscuela')
  findByEscuela(@Payload() idEscuela: string) {
    return this.lineasFacultadService.findByEscuela(idEscuela);
  }

  @MessagePattern('lineas-facultad.update')
  update(@Payload() payload: { id: string; updateLineaFacultadDto: UpdateLineaFacultadDto }) {
    return this.lineasFacultadService.update(payload.id, payload.updateLineaFacultadDto);
  }

  @MessagePattern('lineas-facultad.remove')
  remove(@Payload() id: string) {
    return this.lineasFacultadService.remove(id);
  }
}
