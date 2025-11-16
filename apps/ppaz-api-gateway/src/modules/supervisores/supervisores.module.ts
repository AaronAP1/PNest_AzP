import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SupervisoresController } from './supervisores.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SupervisoresController],
})
export class SupervisoresModule {}
