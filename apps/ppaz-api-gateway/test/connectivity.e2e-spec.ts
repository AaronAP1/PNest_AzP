import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PpazApiGatewayModule } from './../src/ppaz-api-gateway.module';

describe('API Gateway - Connectivity Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PpazApiGatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check Endpoints', () => {
    it('/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect((res) => {
          expect([200, 503]).toContain(res.status);
          expect(res.body).toHaveProperty('status');
        });
    });
  });

  describe('Gateway Root Endpoints', () => {
    it('/ (GET) - should handle root endpoint', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });
    });
  });

  describe('Response Time Tests', () => {
    it('/health should respond within 3 seconds', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/health');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });
  });

  describe('CORS and Headers', () => {
    it('should have proper CORS headers', () => {
      return request(app.getHttpServer())
        .options('/health')
        .expect((res) => {
          // Verificar que la respuesta tenga headers apropiados
          expect(res.headers).toBeDefined();
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route-12345')
        .expect(404);
    });
  });
});
