import { Module } from '@nestjs/common';
import { PrivilegiosService } from './privilegios.service';
import { PrivilegiosController } from './privilegios.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrivilegiosController],
  providers: [PrivilegiosService],
  exports: [PrivilegiosService],
})
export class PrivilegiosModule {}
