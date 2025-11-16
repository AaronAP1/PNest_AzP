import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PreguntasController } from './preguntas.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PreguntasController],
})
export class PreguntasModule {}
