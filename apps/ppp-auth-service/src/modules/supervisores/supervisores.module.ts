import { Module } from '@nestjs/common';
import { SupervisoresService } from './supervisores.service';
import { SupervisoresController } from './supervisores.controller';

@Module({
  imports: [],
  controllers: [SupervisoresController],
  providers: [SupervisoresService],
  exports: [SupervisoresService],
})
export class SupervisoresModule {}
