import { Module } from '@nestjs/common';
import { TipoDocumentosService } from './tipo-documentos.service';
import { TipoDocumentosController } from './tipo-documentos.controller';
import { PrismaCompaniasService } from '../../prisma/prisma.service';

@Module({
  controllers: [TipoDocumentosController],
  providers: [TipoDocumentosService, PrismaCompaniasService],
  exports: [TipoDocumentosService],
})
export class TipoDocumentosModule {}
