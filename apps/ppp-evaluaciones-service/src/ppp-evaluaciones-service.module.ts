import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { DimensionTransversalModule } from './modules/dimension-transversal/dimension-transversal.module';
import { PreguntasModule } from './modules/preguntas/preguntas.module';
import { EvaluacionSupervisorModule } from './modules/evaluacion-supervisor/evaluacion-supervisor.module';
import { EvaluacionPreguntaModule } from './modules/evaluacion-pregunta/evaluacion-pregunta.module';
import { EvaluacionPracticanteModule } from './modules/evaluacion-practicante/evaluacion-practicante.module';
import { EvaluacionPracticanteSolicitudModule } from './modules/evaluacion-practicante-solicitud/evaluacion-practicante-solicitud.module';
import { PreguntaLineaModule } from './modules/pregunta-linea/pregunta-linea.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    HealthModule,
    DimensionTransversalModule,
    PreguntasModule,
    EvaluacionSupervisorModule,
    EvaluacionPreguntaModule,
    EvaluacionPracticanteModule,
    EvaluacionPracticanteSolicitudModule,
    PreguntaLineaModule,
  ],
})
export class PppEvaluacionesServiceModule {}
