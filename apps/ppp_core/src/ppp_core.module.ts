import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PppCoreController } from './ppp_core.controller';
import { PppCoreService } from './ppp_core.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsuariosModule,
    RolesModule,
  ],
  controllers: [PppCoreController],
  providers: [PppCoreService],
})
export class PppCoreModule {}
