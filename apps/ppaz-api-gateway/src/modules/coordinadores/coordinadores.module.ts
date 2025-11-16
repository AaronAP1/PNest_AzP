import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CoordinadoresController } from './coordinadores.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CoordinadoresController],
})
export class CoordinadoresModule {}
