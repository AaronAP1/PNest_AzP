import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EmpresasController } from './empresas.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EmpresasController],
})
export class EmpresasModule {}
