import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    ClientsModule.registerAsync([
      {
        name: 'PPP_CORE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PPP_CORE_HOST'),
            port: configService.get<number>('PPP_CORE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PPP_COMPANIAS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PPP_COMPANIAS_HOST'),
            port: configService.get<number>('PPP_COMPANIAS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
    UsuariosModule,
    RolesModule,
    FacultadesModule,
    EscuelasModule,
    SecretariasModule,
    AlumnosModule,
    EmpresasModule,
    CartasPresentacionModule,
  ],
  controllers: [PpazApiGatewayController],
  providers: [PpazApiGatewayService],
  exports: [ClientsModule],
})
export class PpazApiGatewayModule {}
