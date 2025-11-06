import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RolesController } from './roles.controller';

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
  controllers: [RolesController],
})
export class RolesModule {}
