import { Module } from '@nestjs/common';
import { EvaluacionPracticanteController } from './evaluacion-practicante.controller';
import { EvaluacionPracticanteService } from './evaluacion-practicante.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluacionPracticanteController],
  providers: [EvaluacionPracticanteService],
  exports: [EvaluacionPracticanteService],
})
export class EvaluacionPracticanteModule {}
