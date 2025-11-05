import { Injectable } from '@nestjs/common';

@Injectable()
export class PpazApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
