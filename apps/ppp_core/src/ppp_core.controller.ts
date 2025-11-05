import { Controller, Get } from '@nestjs/common';
import { PppCoreService } from './ppp_core.service';

@Controller()
export class PppCoreController {
  constructor(private readonly pppCoreService: PppCoreService) {}

  @Get()
  getHello(): string {
    return this.pppCoreService.getHello();
  }
}
