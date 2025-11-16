import { Module } from '@nestjs/common';
import { DimensionTransversalService } from './dimension-transversal.service';
import { DimensionTransversalController } from './dimension-transversal.controller';

@Module({
  providers: [DimensionTransversalService],
  controllers: [DimensionTransversalController]
})
export class DimensionTransversalModule {}
