import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  findAllHttp() {
    return this.empresasService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.empresasService.findOne(id);
  }

  @Get('ruc/:ruc')
  findByRucHttp(@Param('ruc') ruc: string) {
    return this.empresasService.findByRuc(ruc);
  }

  @Get('sector/:sector')
  findBySectorHttp(@Param('sector') sector: string) {
    return this.empresasService.findBySector(sector);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.empresasService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_empresa' })
  create(@Payload() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @MessagePattern({ cmd: 'find_all_empresas' })
  findAll() {
    return this.empresasService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_empresa' })
  findOne(@Payload() id: string) {
    return this.empresasService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_empresa_by_ruc' })
  findByRuc(@Payload() ruc: string) {
    return this.empresasService.findByRuc(ruc);
  }

  @MessagePattern({ cmd: 'find_empresas_by_sector' })
  findBySector(@Payload() sector: string) {
    return this.empresasService.findBySector(sector);
  }

  @MessagePattern({ cmd: 'update_empresa' })
  update(@Payload() payload: { id: string; updateEmpresaDto: UpdateEmpresaDto }) {
    return this.empresasService.update(payload.id, payload.updateEmpresaDto);
  }

  @MessagePattern({ cmd: 'remove_empresa' })
  remove(@Payload() id: string) {
    return this.empresasService.remove(id);
  }
}
