import { Module } from '@nestjs/common';
import { ReunionesController } from './reuniones.controller';
import { ReunionesService } from './reuniones.service';

@Module({
  imports: [],
  controllers: [ReunionesController],
  providers: [ReunionesService],
  exports: [ReunionesService],
})
export class ReunionesModule {}
