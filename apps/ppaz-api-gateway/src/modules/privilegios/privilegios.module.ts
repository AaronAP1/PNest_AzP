import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrivilegiosController } from './privilegios.controller';
import { PrivilegiosService } from './privilegios.service';

@Module({
  imports: [HttpModule],
  controllers: [PrivilegiosController],
  providers: [PrivilegiosService],
  exports: [PrivilegiosService],
})
export class PrivilegiosModule {}
