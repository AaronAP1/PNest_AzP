import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PppCompañiasController } from './ppp_compañias.controller';
import { PppCompañiasService } from './ppp_compañias.service';
import { PrismaCompaniasService } from './prisma/prisma.service';
import { TipoDocumentosModule } from './modules/tipo-documentos/tipo-documentos.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { CartasPresentacionModule } from './modules/cartas-presentacion/cartas-presentacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TipoDocumentosModule,
    DocumentosModule,
    EmpresasModule,
    CartasPresentacionModule,
  ],
  controllers: [PppCompañiasController],
  providers: [PppCompañiasService, PrismaCompaniasService],
  exports: [PrismaCompaniasService],
})
export class PppCompañiasModule {}
