import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EvaluacionSupervisorController } from './evaluacion-supervisor.controller';
import { EvaluacionSupervisorService } from './evaluacion-supervisor.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [EvaluacionSupervisorController],
  providers: [EvaluacionSupervisorService],
  exports: [EvaluacionSupervisorService],
})
export class EvaluacionSupervisorModule {}
