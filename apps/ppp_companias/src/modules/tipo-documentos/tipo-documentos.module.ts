import { Module } from '@nestjs/common';
import { TipoDocumentosService } from './tipo-documentos.service';
import { TipoDocumentosController } from './tipo-documentos.controller';

@Module({
  controllers: [TipoDocumentosController],
  providers: [TipoDocumentosService],
  exports: [TipoDocumentosService],
})
export class TipoDocumentosModule {}
