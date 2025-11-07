import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartasPresentacionController } from './cartas-presentacion.controller';

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
  controllers: [CartasPresentacionController],
})
export class CartasPresentacionModule {}
