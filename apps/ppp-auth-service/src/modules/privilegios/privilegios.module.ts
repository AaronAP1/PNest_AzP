import { Module } from '@nestjs/common';
import { PrivilegiosService } from './privilegios.service';
import { PrivilegiosController } from './privilegios.controller';

@Module({
  imports: [],
  controllers: [PrivilegiosController],
  providers: [PrivilegiosService],
  exports: [PrivilegiosService],
})
export class PrivilegiosModule {}
