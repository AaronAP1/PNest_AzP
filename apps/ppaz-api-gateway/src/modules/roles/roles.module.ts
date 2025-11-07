import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { RolesController } from './roles.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [RolesController],
})
export class RolesModule {}
