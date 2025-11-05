import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PppCompañiasService } from './ppp_compañias.service';

@Controller()
export class PppCompañiasController {
  constructor(private readonly pppCompañiasService: PppCompañiasService) {}

  @MessagePattern({ cmd: 'get_hello_companias' })
  getHello(): string {
    return this.pppCompañiasService.getHello();
  }

  @MessagePattern({ cmd: 'get_all_companies' })
  getAllCompanies() {
    return {
      message: 'Lista de compañías',
      companies: [
        { id: 1, name: 'Compañía A', ruc: '20123456789' },
        { id: 2, name: 'Compañía B', ruc: '20987654321' },
      ],
    };
  }

  @MessagePattern({ cmd: 'get_company_by_id' })
  getCompanyById(id: number) {
    return {
      id,
      name: `Compañía ${id}`,
      ruc: `201234567${id}9`,
      address: 'Dirección de ejemplo',
    };
  }
}
