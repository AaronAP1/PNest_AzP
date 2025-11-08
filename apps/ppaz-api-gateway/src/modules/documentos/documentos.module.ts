import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DocumentosController } from './documentos.controller';

@Module({
  imports: [HttpModule],
  controllers: [DocumentosController],
})
export class DocumentosModule {}
