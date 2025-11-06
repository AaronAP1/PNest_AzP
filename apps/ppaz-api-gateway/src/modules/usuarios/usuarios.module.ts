import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsuariosController } from './usuarios.controller';

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
    ]),
  ],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
