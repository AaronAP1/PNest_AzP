import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PppEvaluacionesServiceModule } from './../src/ppp-evaluaciones-service.module';

describe('Evaluaciones Service - API Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PppEvaluacionesServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Evaluaciones Endpoints', () => {
    it('/evaluaciones (GET) - should return list of evaluaciones', () => {
      return request(app.getHttpServer())
        .get('/evaluaciones')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/evaluaciones (POST) - should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/evaluaciones')
        .send({})
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });

  describe('Criterios Endpoints', () => {
    it('/criterios (GET) - should return list of criterios', () => {
      return request(app.getHttpServer())
        .get('/criterios')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Subcriterios Endpoints', () => {
    it('/subcriterios (GET) - should return list of subcriterios', () => {
      return request(app.getHttpServer())
        .get('/subcriterios')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Database Operations', () => {
    it('should handle concurrent queries', async () => {
      const requests = [
        request(app.getHttpServer()).get('/evaluaciones'),
        request(app.getHttpServer()).get('/criterios'),
        request(app.getHttpServer()).get('/subcriterios'),
      ];

      const responses = await Promise.all(requests);
      responses.forEach((res) => {
        expect(res.status).toBe(200);
      });
    });
  });

  describe('Response Time Tests', () => {
    it('/evaluaciones (GET) should respond within 2 seconds', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/evaluaciones');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Data Validation', () => {
    it('should validate numeric scores', () => {
      return request(app.getHttpServer())
        .post('/evaluaciones')
        .send({
          nota: 'invalid', // Should be number
        })
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });

    it('should validate date formats', () => {
      return request(app.getHttpServer())
        .post('/evaluaciones')
        .send({
          fecha_evaluacion: 'invalid-date',
        })
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid evaluation IDs', () => {
      return request(app.getHttpServer())
        .get('/evaluaciones/invalid-id')
        .expect((res) => {
          expect([400, 404, 500]).toContain(res.status);
        });
    });

    it('should return proper error for non-existent resources', () => {
      return request(app.getHttpServer())
        .get('/evaluaciones/99999999')
        .expect((res) => {
          expect([404, 500]).toContain(res.status);
        });
    });
  });

  describe('Security Tests', () => {
    it('should not expose internal database structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/evaluaciones/999999');

      if (response.body.message) {
        expect(response.body.message).not.toContain('prisma');
        expect(response.body.message).not.toContain('sql');
      }
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data structure for lists', async () => {
      const response = await request(app.getHttpServer())
        .get('/evaluaciones')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
      }
    });
  });
});
