import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PppCompañiasController } from './ppp_compañias.controller';
import { PppCompañiasService } from './ppp_compañias.service';
import { PrismaCompaniasModule } from './prisma/prisma.module';
import { TipoDocumentosModule } from './modules/tipo-documentos/tipo-documentos.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { CartasPresentacionModule } from './modules/cartas-presentacion/cartas-presentacion.module';
import { SolicitudesPppModule } from './modules/solicitudes-ppp/solicitudes-ppp.module';
import { ReunionesModule } from './modules/reuniones/reuniones.module';
import { configValidationSchema } from './config/config.validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    PrismaCompaniasModule,
    HealthModule,
    TipoDocumentosModule,
    DocumentosModule,
    EmpresasModule,
    CartasPresentacionModule,
    SolicitudesPppModule,
    ReunionesModule,
  ],
  controllers: [PppCompañiasController],
  providers: [PppCompañiasService],
})
export class PppCompañiasModule {}
