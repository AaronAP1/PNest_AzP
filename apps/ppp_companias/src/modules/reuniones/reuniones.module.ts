import { Module } from '@nestjs/common';
import { ReunionesController } from './reuniones.controller';
import { ReunionesService } from './reuniones.service';
import { PrismaCompaniasModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaCompaniasModule],
  controllers: [ReunionesController],
  providers: [ReunionesService],
  exports: [ReunionesService],
})
export class ReunionesModule {}
