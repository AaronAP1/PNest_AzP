import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto, UpdateDocumentoDto } from './dto';

@Controller()
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

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
