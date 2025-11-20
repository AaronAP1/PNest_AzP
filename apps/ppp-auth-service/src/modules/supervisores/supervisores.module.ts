import { Module } from '@nestjs/common';
import { SupervisoresService } from './supervisores.service';
import { SupervisoresController } from './supervisores.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupervisoresController],
  providers: [SupervisoresService],
  exports: [SupervisoresService],
})
export class SupervisoresModule {}
