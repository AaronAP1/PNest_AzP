import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../node_modules/.prisma/client-companias';

@Injectable()
export class PrismaCompaniasService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  documento: any;
    tipoDocumento: any;
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma Compañías connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma Compañías disconnected from database');
  }
}
