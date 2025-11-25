import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    // PrismaModule es @Global(), no necesita importarse aquí
  ],
  controllers: [HealthController],
})
export class HealthModule {}
