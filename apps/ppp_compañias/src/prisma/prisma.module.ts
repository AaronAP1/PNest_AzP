import { Module, Global } from '@nestjs/common';
import { PrismaCompaniasService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaCompaniasService],
  exports: [PrismaCompaniasService],
})
export class PrismaCompaniasModule {}
