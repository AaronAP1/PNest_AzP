import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PPP_CORE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'PPP_COMPANIAS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
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
