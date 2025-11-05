import { Module } from '@nestjs/common';
import { PppCoreController } from './ppp_core.controller';
import { PppCoreService } from './ppp_core.service';

@Module({
  imports: [],
  controllers: [PppCoreController],
  providers: [PppCoreService],
})
export class PppCoreModule {}
