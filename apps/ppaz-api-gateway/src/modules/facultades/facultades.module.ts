import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FacultadesController } from './facultades.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FacultadesController],
})
export class FacultadesModule {}
