import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LineasFacultadController } from './lineas-facultad.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [LineasFacultadController],
})
export class LineasFacultadModule {}
