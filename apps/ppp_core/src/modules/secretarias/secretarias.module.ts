import { Module } from '@nestjs/common';
import { SecretariasService } from './secretarias.service';
import { SecretariasController } from './secretarias.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SecretariasController],
  providers: [SecretariasService, PrismaService],
  exports: [SecretariasService],
})
export class SecretariasModule {}
