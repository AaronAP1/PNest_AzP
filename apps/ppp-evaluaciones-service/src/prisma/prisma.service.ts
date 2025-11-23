import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../node_modules/.prisma/client-evaluaciones';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_EVALUACIONES + '?connection_limit=10&pool_timeout=20',
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma Evaluaciones-Service connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma Evaluaciones-Service disconnected from database');
  }
}
