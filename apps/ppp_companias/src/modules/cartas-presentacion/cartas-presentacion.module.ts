import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { CartasPresentacionService } from './cartas-presentacion.service';
import { CartasPresentacionController } from './cartas-presentacion.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ClientsModule.register([
      {
        name: 'PPP_CORE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PPP_CORE_HOST || 'localhost',
          port: parseInt(process.env.PPP_CORE_PORT || '3001'),
        },
      },
    ]),
  ],
  controllers: [CartasPresentacionController],
  providers: [CartasPresentacionService],
  exports: [CartasPresentacionService],
})
export class CartasPresentacionModule {}
