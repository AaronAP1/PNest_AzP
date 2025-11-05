import { Controller, Get } from '@nestjs/common';
import { PppCompañiasService } from './ppp_compañias.service';

@Controller()
export class PppCompañiasController {
  constructor(private readonly pppCompañiasService: PppCompañiasService) {}

  @Get()
  getHello(): string {
    return this.pppCompañiasService.getHello();
  }
}
