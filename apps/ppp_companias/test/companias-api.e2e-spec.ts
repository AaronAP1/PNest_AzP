import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PppCompaniasModule } from './../src/ppp_companias.module';

describe('Companias Service - API Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PppCompaniasModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Companias Endpoints', () => {
    it('/companias (GET) - should return list of companias', () => {
      return request(app.getHttpServer())
        .get('/companias')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/companias (POST) - should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/companias')
        .send({})
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });

  describe('Solicitudes PPP Endpoints', () => {
    it('/solicitudes-ppp (GET) - should return list of solicitudes', () => {
      return request(app.getHttpServer())
        .get('/solicitudes-ppp')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/solicitudes-ppp/count/by-estado (GET) - should return count statistics', () => {
      return request(app.getHttpServer())
        .get('/solicitudes-ppp/count/by-estado')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  describe('SUNAT Integration', () => {
    it('/sunat/consultar-ruc (GET) - should validate RUC parameter', () => {
      return request(app.getHttpServer())
        .get('/sunat/consultar-ruc')
        .expect((res) => {
          expect([400, 422, 500]).toContain(res.status);
        });
    });

    it('/sunat/consultar-ruc (GET) - with invalid RUC format', () => {
      return request(app.getHttpServer())
        .get('/sunat/consultar-ruc?ruc=invalid')
        .expect((res) => {
          expect([400, 404, 422, 500]).toContain(res.status);
        });
    });
  });

  describe('Tipo Documentos Endpoints', () => {
    it('/tipo-documentos (GET) - should return document types', () => {
      return request(app.getHttpServer())
        .get('/tipo-documentos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Database Operations', () => {
    it('should handle concurrent requests', async () => {
      const requests = [
        request(app.getHttpServer()).get('/companias'),
        request(app.getHttpServer()).get('/solicitudes-ppp'),
        request(app.getHttpServer()).get('/tipo-documentos'),
      ];

      const responses = await Promise.all(requests);
      responses.forEach((res) => {
        expect(res.status).toBe(200);
      });
    });
  });

  describe('Response Time Tests', () => {
    it('/companias (GET) should respond within 2 seconds', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/companias');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Data Validation', () => {
    it('should reject POST requests with invalid data types', () => {
      return request(app.getHttpServer())
        .post('/companias')
        .send({
          razon_social: 123, // Should be string
          ruc: 'invalid',
        })
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });
});
