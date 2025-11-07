import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EscuelasController } from './escuelas.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EscuelasController],
})
export class EscuelasModule {}
