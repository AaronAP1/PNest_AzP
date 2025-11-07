import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CartasPresentacionController } from './cartas-presentacion.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CartasPresentacionController],
})
export class CartasPresentacionModule {}
