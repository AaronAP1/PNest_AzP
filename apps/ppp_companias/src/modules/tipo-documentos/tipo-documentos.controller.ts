import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TipoDocumentosService } from './tipo-documentos.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@Controller('tipo-documentos')
export class TipoDocumentosController {
  constructor(private readonly tipoDocumentosService: TipoDocumentosService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return this.tipoDocumentosService.create(createTipoDocumentoDto);
  }

  @Get()
  findAllHttp() {
    return this.tipoDocumentosService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.tipoDocumentosService.findOne(id);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto) {
    return this.tipoDocumentosService.update(id, updateTipoDocumentoDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.tipoDocumentosService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_tipo_documento' })
  create(@Payload() createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return this.tipoDocumentosService.create(createTipoDocumentoDto);
  }

  @MessagePattern({ cmd: 'find_all_tipo_documentos' })
  findAll() {
    return this.tipoDocumentosService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_tipo_documento' })
  findOne(@Payload() id: string) {
    return this.tipoDocumentosService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_tipo_documento' })
  update(@Payload() payload: { id: string; data: UpdateTipoDocumentoDto }) {
    return this.tipoDocumentosService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_tipo_documento' })
  remove(@Payload() id: string) {
    return this.tipoDocumentosService.remove(id);
  }
}
