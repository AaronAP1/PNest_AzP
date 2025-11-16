import { Module } from '@nestjs/common';
import { EvaluacionSupervisorController } from './evaluacion-supervisor.controller';
import { EvaluacionSupervisorService } from './evaluacion-supervisor.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluacionSupervisorController],
  providers: [EvaluacionSupervisorService],
  exports: [EvaluacionSupervisorService],
})
export class EvaluacionSupervisorModule {}
