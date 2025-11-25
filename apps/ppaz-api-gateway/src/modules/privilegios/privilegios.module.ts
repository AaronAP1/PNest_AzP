import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrivilegiosController } from './privilegios.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [PrivilegiosController],
})
export class PrivilegiosModule {}
