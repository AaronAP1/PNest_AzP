import { Module } from '@nestjs/common';
import { EscuelasService } from './escuelas.service';
import { EscuelasController } from './escuelas.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EscuelasController],
  providers: [EscuelasService, PrismaService],
  exports: [EscuelasService],
})
export class EscuelasModule {}
