import { Module } from '@nestjs/common';
import { LineasFacultadService } from './lineas-facultad.service';
import { LineasFacultadController } from './lineas-facultad.controller';

@Module({
  controllers: [LineasFacultadController],
  providers: [LineasFacultadService],
  exports: [LineasFacultadService],
})
export class LineasFacultadModule {}
