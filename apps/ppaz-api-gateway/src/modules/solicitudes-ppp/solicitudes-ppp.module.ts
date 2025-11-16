import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SolicitudesPppController } from './solicitudes-ppp.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SolicitudesPppController],
})
export class SolicitudesPppModule {}
