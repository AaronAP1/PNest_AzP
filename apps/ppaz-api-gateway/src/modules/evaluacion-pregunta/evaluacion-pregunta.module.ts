import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EvaluacionPreguntaController } from './evaluacion-pregunta.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EvaluacionPreguntaController],
})
export class EvaluacionPreguntaModule {}
