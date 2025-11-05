import { Test, TestingModule } from '@nestjs/testing';
import { PpazApiGatewayController } from './ppaz-api-gateway.controller';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';

describe('PpazApiGatewayController', () => {
  let ppazApiGatewayController: PpazApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PpazApiGatewayController],
      providers: [PpazApiGatewayService],
    }).compile();

    ppazApiGatewayController = app.get<PpazApiGatewayController>(PpazApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ppazApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
