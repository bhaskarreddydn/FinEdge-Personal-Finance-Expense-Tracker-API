const request = require('supertest');
const fs = require('fs/promises');
const path = require('path');
const app = require('../src/app');

const USERS_FILE_PATH = path.join(__dirname, '../src/data/users.json');

describe('Demo & Architecture Verification API', () => {
  let validToken = '';

  beforeAll(async () => {
    // Ensure clean state and register a user to obtain a valid token
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');

    await request(app)
      .post('/users')
      .send({
        name: 'Demo User',
        email: 'demo@finedge.com',
        password: 'password123',
      });

    const loginRes = await request(app)
      .post('/users/login')
      .send({
        email: 'demo@finedge.com',
        password: 'password123',
      });

    validToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  });

  describe('GET /demo/protected (Authentication Middleware)', () => {
    it('should grant access and return authenticated req.user when valid Bearer token is provided', async () => {
      const res = await request(app)
        .get('/demo/protected')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('You accessed a protected route');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('demo@finedge.com');
      expect(res.body.data.user).toHaveProperty('id');
    });

    it('should reject access with 401 UNAUTHORIZED when Authorization header is missing', async () => {
      const res = await request(app).get('/demo/protected');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject access with 401 INVALID_TOKEN_FORMAT when Bearer prefix is missing', async () => {
      const res = await request(app)
        .get('/demo/protected')
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_TOKEN_FORMAT');
    });

    it('should reject access with 401 INVALID_TOKEN when token is forged or invalid', async () => {
      const res = await request(app)
        .get('/demo/protected')
        .set('Authorization', 'Bearer invalid.token.payload');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('GET /demo/error (Custom AppError and Global Error Handler)', () => {
    it('should route custom AppError to global error handler and return standardized JSON error', async () => {
      const res = await request(app).get('/demo/error');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: {
          code: 'DEMO_ERROR',
          message: 'This is a demonstration error',
        },
      });
    });
  });
});
