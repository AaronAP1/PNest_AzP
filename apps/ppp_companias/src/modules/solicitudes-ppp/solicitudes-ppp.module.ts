import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SolicitudesPppController } from './solicitudes-ppp.controller';
import { SolicitudesPppService } from './solicitudes-ppp.service';

@Module({
  imports: [HttpModule],
  controllers: [SolicitudesPppController],
  providers: [SolicitudesPppService],
  exports: [SolicitudesPppService],
})
export class SolicitudesPppModule {}
