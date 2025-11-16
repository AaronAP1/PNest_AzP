import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EvaluacionPracticanteController } from './evaluacion-practicante.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EvaluacionPracticanteController],
})
export class EvaluacionPracticanteModule {}
