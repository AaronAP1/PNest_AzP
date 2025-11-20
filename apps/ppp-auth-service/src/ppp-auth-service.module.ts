import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { PrivilegiosModule } from './modules/privilegios/privilegios.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { SecretariasModule } from './modules/secretarias/secretarias.module';
import { SupervisoresModule } from './modules/supervisores/supervisores.module';
import { CoordinadoresModule } from './modules/coordinadores/coordinadores.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    HealthModule,
    UsuariosModule,
    RolesModule,
    PrivilegiosModule,
    AlumnosModule,
    SecretariasModule,
    SupervisoresModule,
    CoordinadoresModule,
  ],
})
export class PppAuthServiceModule {}
