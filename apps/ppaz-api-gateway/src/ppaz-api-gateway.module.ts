import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PpazApiGatewayController } from './ppaz-api-gateway.controller';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { PrivilegiosModule } from './modules/privilegios/privilegios.module';
import { FacultadesModule } from './modules/facultades/facultades.module';
import { EscuelasModule } from './modules/escuelas/escuelas.module';
import { SecretariasModule } from './modules/secretarias/secretarias.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { SupervisoresModule } from './modules/supervisores/supervisores.module';
import { CoordinadoresModule } from './modules/coordinadores/coordinadores.module';
import { LineasFacultadModule } from './modules/lineas-facultad/lineas-facultad.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { CartasPresentacionModule } from './modules/cartas-presentacion/cartas-presentacion.module';
import { SolicitudesPppModule } from './modules/solicitudes-ppp/solicitudes-ppp.module';
import { ReunionesModule } from './modules/reuniones/reuniones.module';
import { TipoDocumentosModule } from './modules/tipo-documentos/tipo-documentos.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { SunatModule } from './modules/sunat/sunat.module';
import { PreguntasModule } from './modules/preguntas/preguntas.module';
import { PreguntaLineaModule } from './modules/pregunta-linea/pregunta-linea.module';
import { EvaluacionPreguntaModule } from './modules/evaluacion-pregunta/evaluacion-pregunta.module';
import { EvaluacionSupervisorModule } from './modules/evaluacion-supervisor/evaluacion-supervisor.module';
import { EvaluacionPracticanteModule } from './modules/evaluacion-practicante/evaluacion-practicante.module';
import { EvaluacionPracticanteSolicitudModule } from './modules/evaluacion-practicante-solicitud/evaluacion-practicante-solicitud.module';
import { configValidationSchema } from './config/config.validation';
import { HealthModule } from './health/health.module';
import { DimensionTransversalModule } from './modules/dimension-transversal/dimension-transversal.module';

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
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    HealthModule,
    // Auth Service modules
    UsuariosModule,
    RolesModule,
    PrivilegiosModule,
    // Academic Service modules
    FacultadesModule,
    EscuelasModule,
    SecretariasModule,
    AlumnosModule,
    SupervisoresModule,
    CoordinadoresModule,
    LineasFacultadModule,
    // Core Service (ppp_compañías) modules
    EmpresasModule,
    CartasPresentacionModule,
    SolicitudesPppModule,
    ReunionesModule,
    TipoDocumentosModule,
    DocumentosModule,
    SunatModule,
    // Evaluaciones Service modules
    PreguntasModule,
    PreguntaLineaModule,
    EvaluacionPreguntaModule,
    EvaluacionSupervisorModule,
    EvaluacionPracticanteModule,
    EvaluacionPracticanteSolicitudModule,
    DimensionTransversalModule,
  ],
  controllers: [], // PpazApiGatewayController temporalmente deshabilitado
  providers: [PpazApiGatewayService],
})
export class PpazApiGatewayModule {}

