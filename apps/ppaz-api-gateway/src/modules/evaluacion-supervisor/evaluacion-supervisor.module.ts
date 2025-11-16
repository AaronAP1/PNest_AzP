import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EvaluacionSupervisorController } from './evaluacion-supervisor.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EvaluacionSupervisorController],
})
export class EvaluacionSupervisorModule {}
