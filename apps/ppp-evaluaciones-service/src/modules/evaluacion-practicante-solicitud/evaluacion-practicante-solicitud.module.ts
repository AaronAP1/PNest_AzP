import { Module } from '@nestjs/common';
import { EvaluacionPracticanteSolicitudController } from './evaluacion-practicante-solicitud.controller';
import { EvaluacionPracticanteSolicitudService } from './evaluacion-practicante-solicitud.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluacionPracticanteSolicitudController],
  providers: [EvaluacionPracticanteSolicitudService],
  exports: [EvaluacionPracticanteSolicitudService],
})
export class EvaluacionPracticanteSolicitudModule {}
