import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PppCoreController } from './ppp_core.controller';
import { PppCoreService } from './ppp_core.service';
import { PrismaModule } from './prisma/prisma.module';
import { FacultadesModule } from './modules/facultades/facultades.module';
import { EscuelasModule } from './modules/escuelas/escuelas.module';
import { LineasFacultadModule } from './modules/lineas-facultad/lineas-facultad.module';
import { configValidationSchema } from './config/config.validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/ppp_core/.env', '.env', '.env.local'],
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    PrismaModule,
    HealthModule,
    FacultadesModule,
    EscuelasModule,
    LineasFacultadModule,
  ],
  controllers: [PppCoreController],
  providers: [PppCoreService],
})
export class PppCoreModule {}
