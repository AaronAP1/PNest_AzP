import { Injectable } from '@nestjs/common';

@Injectable()
export class PppCoreService {
  getHello(): string {
    return 'Hello World!';
  }
}
