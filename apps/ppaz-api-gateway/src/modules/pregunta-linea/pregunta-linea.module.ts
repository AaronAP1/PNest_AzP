import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PreguntaLineaController } from './pregunta-linea.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PreguntaLineaController],
})
export class PreguntaLineaModule {}
