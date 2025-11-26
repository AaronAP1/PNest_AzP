import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PppAuthServiceModule } from './../src/ppp-auth-service.module';

describe('Auth Service - API Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PppAuthServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Roles Endpoints', () => {
    it('/roles (GET) - should return list of roles', () => {
      return request(app.getHttpServer())
        .get('/roles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/roles (POST) - should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/roles')
        .send({})
        .expect((res) => {
          expect([400, 500]).toContain(res.status);
        });
    });
  });

  describe('Usuarios Endpoints', () => {
    it('/usuarios (GET) - should return list of usuarios', () => {
      return request(app.getHttpServer())
        .get('/usuarios')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/usuarios/:id (GET) - should validate id format', () => {
      return request(app.getHttpServer())
        .get('/usuarios/invalid-id')
        .expect((res) => {
          expect([400, 404, 500]).toContain(res.status);
        });
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive error details in production', () => {
      return request(app.getHttpServer())
        .get('/usuarios/99999999')
        .expect((res) => {
          // No debe exponer detalles internos del servidor
          if (res.body.message) {
            expect(res.body.message).not.toContain('password');
            expect(res.body.message).not.toContain('token');
          }
        });
    });
  });

  describe('Database Connectivity', () => {
    it('should be able to query database through endpoints', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .expect(200);
      
      expect(response.body).toBeDefined();
    });
  });

  describe('Response Time Tests', () => {
    it('/usuarios (GET) should respond within 2 seconds', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/usuarios');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });
});
