import { Module } from '@nestjs/common';
import { PppCompañiasController } from './ppp_compañias.controller';
import { PppCompañiasService } from './ppp_compañias.service';

@Module({
  imports: [],
  controllers: [PppCompañiasController],
  providers: [PppCompañiasService],
})
export class PppCompañiasModule {}
