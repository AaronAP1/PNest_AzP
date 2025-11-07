import { Module } from '@nestjs/common';
import { PppCompañiasController } from './ppp_compañias.controller';
import { PppCompañiasService } from './ppp_compañias.service';
import { PrismaCompaniasService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [PppCompañiasController],
  providers: [PppCompañiasService, PrismaCompaniasService],
  exports: [PrismaCompaniasService],
})
export class PppCompañiasModule {}
