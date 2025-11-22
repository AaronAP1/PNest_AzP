import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PppCompaniasService } from './ppp_companias.service';

@Controller()
export class PppCompaniasController {
  constructor(private readonly pppCompaniasService: PppCompaniasService) {}

  @MessagePattern({ cmd: 'get_hello_companias' })
  getHello(): string {
    return this.pppCompaniasService.getHello();
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
