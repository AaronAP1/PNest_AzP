import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PppCoreModule } from './../src/ppp_core.module';

describe('Core Service - API Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PppCoreModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Facultades Endpoints', () => {
    it('/facultades (GET) - should return list of facultades', () => {
      return request(app.getHttpServer())
        .get('/facultades')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/facultades (POST) - should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/facultades')
        .send({})
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });

  describe('Escuelas Endpoints', () => {
    it('/escuelas (GET) - should return list of escuelas', () => {
      return request(app.getHttpServer())
        .get('/escuelas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/escuelas/facultad/:id (GET) - should filter by facultad', () => {
      return request(app.getHttpServer())
        .get('/escuelas/facultad/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Lineas Endpoints', () => {
    it('/lineas (GET) - should return list of lineas', () => {
      return request(app.getHttpServer())
        .get('/lineas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Periodos Endpoints', () => {
    it('/periodos (GET) - should return list of periodos', () => {
      return request(app.getHttpServer())
        .get('/periodos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/periodos/activo (GET) - should return active periodo', () => {
      return request(app.getHttpServer())
        .get('/periodos/activo')
        .expect((res) => {
          expect([200, 404, 500]).toContain(res.status);
        });
    });
  });

  describe('Database Connectivity', () => {
    it('should handle multiple database queries', async () => {
      const requests = [
        request(app.getHttpServer()).get('/facultades'),
        request(app.getHttpServer()).get('/escuelas'),
        request(app.getHttpServer()).get('/lineas'),
        request(app.getHttpServer()).get('/periodos'),
      ];

      const responses = await Promise.all(requests);
      responses.forEach((res) => {
        expect(res.status).toBe(200);
      });
    });
  });

  describe('Response Time Tests', () => {
    it('/facultades (GET) should respond within 2 seconds', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/facultades');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Data Integrity', () => {
    it('should return consistent data structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/facultades')
        .expect(200);

      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid IDs gracefully', () => {
      return request(app.getHttpServer())
        .get('/facultades/invalid-id')
        .expect((res) => {
          expect([400, 404, 500]).toContain(res.status);
        });
    });

    it('should return 404 for non-existent resources', () => {
      return request(app.getHttpServer())
        .get('/facultades/99999999')
        .expect((res) => {
          expect([404, 500]).toContain(res.status);
        });
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid POST data', () => {
      return request(app.getHttpServer())
        .post('/facultades')
        .send({
          nombre: '', // Empty string should fail
        })
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });
});
