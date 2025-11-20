import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '.prisma/client-companias';

@Injectable()
export class PrismaCompaniasService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma Companias-Service connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma Companias-Service disconnected from database');
  }
}
