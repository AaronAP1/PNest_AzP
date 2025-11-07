import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PpazApiGatewayController } from './ppaz-api-gateway.controller';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { FacultadesModule } from './modules/facultades/facultades.module';
import { EscuelasModule } from './modules/escuelas/escuelas.module';
import { SecretariasModule } from './modules/secretarias/secretarias.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { CartasPresentacionModule } from './modules/cartas-presentacion/cartas-presentacion.module';
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
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    HealthModule,
    UsuariosModule,
    // Temporalmente deshabilitados - solo usuarios está migrado a HTTP
    // RolesModule,
    // FacultadesModule,
    // EscuelasModule,
    // SecretariasModule,
    // AlumnosModule,
    // EmpresasModule,
    // CartasPresentacionModule,
  ],
  controllers: [], // PpazApiGatewayController temporalmente deshabilitado
  providers: [PpazApiGatewayService],
})
export class PpazApiGatewayModule {}

