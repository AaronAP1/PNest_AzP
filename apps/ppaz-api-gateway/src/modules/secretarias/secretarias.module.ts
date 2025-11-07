import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SecretariasController } from './secretarias.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SecretariasController],
})
export class SecretariasModule {}
