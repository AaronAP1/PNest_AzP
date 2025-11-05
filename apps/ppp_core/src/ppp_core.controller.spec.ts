import { Test, TestingModule } from '@nestjs/testing';
import { PppCoreController } from './ppp_core.controller';
import { PppCoreService } from './ppp_core.service';

describe('PppCoreController', () => {
  let pppCoreController: PppCoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PppCoreController],
      providers: [PppCoreService],
    }).compile();

    pppCoreController = app.get<PppCoreController>(PppCoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pppCoreController.getHello()).toBe('Hello World!');
    });
  });
});
