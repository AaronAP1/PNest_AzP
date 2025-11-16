import { Module } from '@nestjs/common';
import { DimensionTransversalController } from './dimension-transversal.controller';
import { DimensionTransversalService } from './dimension-transversal.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DimensionTransversalController],
  providers: [DimensionTransversalService],
  exports: [DimensionTransversalService],
})
export class DimensionTransversalModule {}
