import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EvaluacionPracticanteController } from './evaluacion-practicante.controller';
import { EvaluacionPracticanteService } from './evaluacion-practicante.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [EvaluacionPracticanteController],
  providers: [EvaluacionPracticanteService],
  exports: [EvaluacionPracticanteService],
})
export class EvaluacionPracticanteModule {}
