import { Test, TestingModule } from '@nestjs/testing';
import { PppCompañiasController } from './ppp_compañias.controller';
import { PppCompañiasService } from './ppp_compañias.service';

describe('PppCompañiasController', () => {
  let pppCompañiasController: PppCompañiasController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PppCompañiasController],
      providers: [PppCompañiasService],
    }).compile();

    pppCompañiasController = app.get<PppCompañiasController>(PppCompañiasController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pppCompañiasController.getHello()).toBe('Hello World!');
    });
  });
});
