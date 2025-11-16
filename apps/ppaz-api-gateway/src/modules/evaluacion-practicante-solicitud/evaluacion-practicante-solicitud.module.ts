import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EvaluacionPracticanteSolicitudController } from './evaluacion-practicante-solicitud.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EvaluacionPracticanteSolicitudController],
})
export class EvaluacionPracticanteSolicitudModule {}
