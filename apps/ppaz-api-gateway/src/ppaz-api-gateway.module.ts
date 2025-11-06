import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PpazApiGatewayController } from './ppaz-api-gateway.controller';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';

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
  ],
  controllers: [PpazApiGatewayController],
  providers: [PpazApiGatewayService],
  exports: [ClientsModule],
})
export class PpazApiGatewayModule {}
