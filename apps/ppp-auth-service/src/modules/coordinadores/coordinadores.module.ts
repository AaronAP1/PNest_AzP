import { Module } from '@nestjs/common';
import { CoordinadoresService } from './coordinadores.service';
import { CoordinadoresController } from './coordinadores.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoordinadoresController],
  providers: [CoordinadoresService],
  exports: [CoordinadoresService],
})
export class CoordinadoresModule {}
