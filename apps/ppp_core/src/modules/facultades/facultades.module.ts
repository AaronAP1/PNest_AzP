import { Module } from '@nestjs/common';
import { FacultadesService } from './facultades.service';
import { FacultadesController } from './facultades.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [FacultadesController],
  providers: [FacultadesService, PrismaService],
  exports: [FacultadesService],
})
export class FacultadesModule {}
