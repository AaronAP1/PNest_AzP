import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PppCoreService } from './ppp_core.service';

@Controller()
export class PppCoreController {
  constructor(private readonly pppCoreService: PppCoreService) {}

  @MessagePattern({ cmd: 'get_hello_core' })
  getHello(): string {
    return this.pppCoreService.getHello();
  }

  @MessagePattern({ cmd: 'get_core_data' })
  getCoreData(data: any) {
    return {
      message: 'Datos desde ppp_core',
      receivedData: data,
      timestamp: new Date().toISOString(),
    };
  }
}
