import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DimensionTransversalController } from './dimension-transversal.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DimensionTransversalController],
})
export class DimensionTransversalModule {}
