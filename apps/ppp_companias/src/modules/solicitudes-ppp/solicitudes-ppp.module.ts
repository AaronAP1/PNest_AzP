import { Module } from '@nestjs/common';
import { SolicitudesPppController } from './solicitudes-ppp.controller';
import { SolicitudesPppService } from './solicitudes-ppp.service';
import { PrismaCompaniasModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaCompaniasModule],
  controllers: [SolicitudesPppController],
  providers: [SolicitudesPppService],
  exports: [SolicitudesPppService],
})
export class SolicitudesPppModule {}
