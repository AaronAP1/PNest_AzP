import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PppCoreController } from './ppp_core.controller';
import { PppCoreService } from './ppp_core.service';
import { PrismaModule } from './prisma/prisma.module';
import { FacultadesModule } from './modules/facultades/facultades.module';
import { EscuelasModule } from './modules/escuelas/escuelas.module';
import { SecretariasModule } from './modules/secretarias/secretarias.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { SupervisoresModule } from './modules/supervisores/supervisores.module';
import { CoordinadoresModule } from './modules/coordinadores/coordinadores.module';
import { LineasFacultadModule } from './modules/lineas-facultad/lineas-facultad.module';
import { configValidationSchema } from './config/config.validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    PrismaModule,
    HealthModule,
    FacultadesModule,
    EscuelasModule,
    AlumnosModule,
    SecretariasModule,
    SupervisoresModule,
    CoordinadoresModule,
    LineasFacultadModule,
  ],
  controllers: [PppCoreController],
  providers: [PppCoreService],
})
export class PppCoreModule {}
