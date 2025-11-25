import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto, UpdateDocumentoDto } from './dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentosService.create(createDocumentoDto);
  }

  @Get()
  findAllHttp() {
    return this.documentosService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.documentosService.findOne(id);
  }

  @Get('tipo/:idTipoDocumento')
  findByTipoHttp(@Param('idTipoDocumento') idTipoDocumento: string) {
    return this.documentosService.findByTipoDocumento(idTipoDocumento);
  }

  @Get('subido-por/:subidoPor')
  findBySubidoPorHttp(@Param('subidoPor') subidoPor: string) {
    return this.documentosService.findBySubidoPor(subidoPor);
  }

  @Get('generado-por/:generadoPor')
  findByGeneradoPorHttp(@Param('generadoPor') generadoPor: string) {
    return this.documentosService.findByGeneradoPor(generadoPor);
  }

  @Put(':id')
  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateDocumentoDto: UpdateDocumentoDto) {
    return this.documentosService.update(id, updateDocumentoDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.documentosService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_documento' })
  create(@Payload() createDocumentoDto: CreateDocumentoDto) {
    return this.documentosService.create(createDocumentoDto);
  }

  @MessagePattern({ cmd: 'find_all_documentos' })
  findAll() {
    return this.documentosService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_documento' })
  findOne(@Payload() id: string) {
    return this.documentosService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_documentos_by_tipo' })
  findByTipoDocumento(@Payload() idTipoDocumento: string) {
    return this.documentosService.findByTipoDocumento(idTipoDocumento);
  }

  @MessagePattern({ cmd: 'find_documentos_by_subido_por' })
  findBySubidoPor(@Payload() subidoPor: string) {
    return this.documentosService.findBySubidoPor(subidoPor);
  }

  @MessagePattern({ cmd: 'find_documentos_by_generado_por' })
  findByGeneradoPor(@Payload() generadoPor: string) {
    return this.documentosService.findByGeneradoPor(generadoPor);
  }

  @MessagePattern({ cmd: 'update_documento' })
  update(@Payload() payload: { id: string; updateDocumentoDto: UpdateDocumentoDto }) {
    return this.documentosService.update(payload.id, payload.updateDocumentoDto);
  }

  @MessagePattern({ cmd: 'remove_documento' })
  remove(@Payload() id: string) {
    return this.documentosService.remove(id);
  }
}
