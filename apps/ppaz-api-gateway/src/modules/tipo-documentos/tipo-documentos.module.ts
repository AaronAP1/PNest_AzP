import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TipoDocumentosController } from './tipo-documentos.controller';

@Module({
  imports: [HttpModule],
  controllers: [TipoDocumentosController],
})
export class TipoDocumentosModule {}
