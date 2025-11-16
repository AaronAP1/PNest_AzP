import { Module } from '@nestjs/common';
import { EvaluacionPreguntaController } from './evaluacion-pregunta.controller';
import { EvaluacionPreguntaService } from './evaluacion-pregunta.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluacionPreguntaController],
  providers: [EvaluacionPreguntaService],
  exports: [EvaluacionPreguntaService],
})
export class EvaluacionPreguntaModule {}
