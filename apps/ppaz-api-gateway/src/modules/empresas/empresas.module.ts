import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PPP_COMPANIAS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [EmpresasController],
})
export class EmpresasModule {}
