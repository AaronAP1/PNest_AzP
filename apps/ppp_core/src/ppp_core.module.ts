import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PppCoreController } from './ppp_core.controller';
import { PppCoreService } from './ppp_core.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { FacultadesModule } from './modules/facultades/facultades.module';
import { EscuelasModule } from './modules/escuelas/escuelas.module';
import { SecretariasModule } from './modules/secretarias/secretarias.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsuariosModule,
    RolesModule,
    FacultadesModule,
    EscuelasModule,
    SecretariasModule,
    AlumnosModule,
  ],
  controllers: [PppCoreController],
  providers: [PppCoreService],
})
export class PppCoreModule {}
