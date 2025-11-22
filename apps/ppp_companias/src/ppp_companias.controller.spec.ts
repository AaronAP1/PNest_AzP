import { Test, TestingModule } from '@nestjs/testing';
import { PppCompaniasController } from './ppp_companias.controller';
import { PppCompaniasService } from './ppp_companias.service';

describe('PppCompaniasController', () => {
  let pppCompaniasController: PppCompaniasController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PppCompaniasController],
      providers: [PppCompaniasService],
    }).compile();

    pppCompaniasController = app.get<PppCompaniasController>(PppCompaniasController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pppCompaniasController.getHello()).toBe('Hello World!');
    });
  });
});
