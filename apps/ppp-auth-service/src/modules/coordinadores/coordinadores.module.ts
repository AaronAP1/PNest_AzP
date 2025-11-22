import { Module } from '@nestjs/common';
import { CoordinadoresService } from './coordinadores.service';
import { CoordinadoresController } from './coordinadores.controller';

@Module({
  imports: [],
  controllers: [CoordinadoresController],
  providers: [CoordinadoresService],
  exports: [CoordinadoresService],
})
export class CoordinadoresModule {}
