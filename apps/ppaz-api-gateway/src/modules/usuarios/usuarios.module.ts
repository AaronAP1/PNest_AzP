import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
