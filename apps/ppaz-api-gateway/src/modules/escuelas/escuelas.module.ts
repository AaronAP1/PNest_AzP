import { Module } from '@nestjs/common';
import { EscuelasController } from './escuelas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  controllers: [EscuelasController],
})
export class EscuelasModule {}
