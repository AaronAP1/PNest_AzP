import { Module } from '@nestjs/common';
import { PreguntaLineaController } from './pregunta-linea.controller';
import { PreguntaLineaService } from './pregunta-linea.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PreguntaLineaController],
  providers: [PreguntaLineaService],
  exports: [PreguntaLineaService],
})
export class PreguntaLineaModule {}
