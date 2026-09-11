const request = require('supertest');
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = require('../src/app');

const AppError = require('../src/utils/AppError');
const {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
} = require('../src/utils/errors');
const { createRateLimiter } = require('../src/middleware/rateLimiter');
const errorHandler = require('../src/middleware/errorHandler');

const USERS_FILE_PATH = path.join(__dirname, '../src/data/users.json');
const TRANSACTIONS_FILE_PATH = path.join(__dirname, '../src/data/transactions.json');

const VALID_TRANSACTION = {
  type: 'expense',
  category: 'Food',
  amount: 450,
  date: '2026-09-04',
  description: 'Dinner',
};

describe('Member 3: Middleware, Validation and Error Handling', () => {
  let token = '';
  let usersBackup = '[]';
  let transactionsBackup = '[]';

  beforeAll(async () => {
    // Snapshot the committed data files so the suite can restore them
    // afterwards instead of leaving the repository with wiped seed data.
    usersBackup = await fs.readFile(USERS_FILE_PATH, 'utf-8');
    transactionsBackup = await fs.readFile(TRANSACTIONS_FILE_PATH, 'utf-8');

    await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
    await fs.writeFile(TRANSACTIONS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');

    await request(app).post('/users').send({
      name: 'Middleware Tester',
      email: 'middleware@finedge.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/users/login').send({
      email: 'middleware@finedge.com',
      password: 'password123',
    });

    token = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await fs.writeFile(USERS_FILE_PATH, usersBackup, 'utf-8');
    await fs.writeFile(TRANSACTIONS_FILE_PATH, transactionsBackup, 'utf-8');
  });

  const post = (body) => request(app)
    .post('/transactions')
    .set('Authorization', `Bearer ${token}`)
    .send(body);

  const patch = (id, body) => request(app)
    .patch(`/transactions/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(body);

  describe('Custom error classes', () => {
    it('should all extend AppError so the global handler can serialise them', () => {
      const errors = [
        new ValidationError(),
        new UnauthorizedError(),
        new ForbiddenError(),
        new NotFoundError('Transaction'),
        new ConflictError(),
        new TooManyRequestsError(),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toBeInstanceOf(Error);
        expect(error.isOperational).toBe(true);
      });
    });

    it('should carry the correct status code and error code for each category', () => {
      expect(new ValidationError().statusCode).toBe(400);
      expect(new ValidationError().errorCode).toBe('VALIDATION_ERROR');
      expect(new UnauthorizedError().statusCode).toBe(401);
      expect(new ForbiddenError().statusCode).toBe(403);
      expect(new NotFoundError().statusCode).toBe(404);
      expect(new ConflictError().statusCode).toBe(409);
      expect(new TooManyRequestsError().statusCode).toBe(429);
    });

    it('should build the message from the resource name for NotFoundError', () => {
      expect(new NotFoundError('Transaction').message).toBe('Transaction not found');
    });
  });

  describe('validateCreateTransaction (POST /transactions)', () => {
    it('should accept a fully valid transaction', async () => {
      const res = await post(VALID_TRANSACTION);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject a missing type', async () => {
      const res = await post({ ...VALID_TRANSACTION, type: undefined });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toBe('Transaction type is required');
    });

    it('should reject a type outside income and expense', async () => {
      const res = await post({ ...VALID_TRANSACTION, type: 'banana' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toMatch(/income.*expense/);
    });

    it('should reject a missing or empty category', async () => {
      expect((await post({ ...VALID_TRANSACTION, category: undefined })).statusCode).toBe(400);
      expect((await post({ ...VALID_TRANSACTION, category: '   ' })).statusCode).toBe(400);
    });

    it('should reject a negative or zero amount', async () => {
      const negative = await post({ ...VALID_TRANSACTION, amount: -450 });
      expect(negative.statusCode).toBe(400);
      expect(negative.body.error.message).toBe('Amount must be greater than zero');

      const zero = await post({ ...VALID_TRANSACTION, amount: 0 });
      expect(zero.statusCode).toBe(400);
    });

    it('should reject a non-numeric amount, including numeric strings', async () => {
      expect((await post({ ...VALID_TRANSACTION, amount: '450' })).statusCode).toBe(400);
      expect((await post({ ...VALID_TRANSACTION, amount: true })).statusCode).toBe(400);
    });

    it('should reject a missing date', async () => {
      const res = await post({ ...VALID_TRANSACTION, date: undefined });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toBe('Date is required');
    });

    it('should reject dates that are not YYYY-MM-DD, since range filters compare strings', async () => {
      expect((await post({ ...VALID_TRANSACTION, date: '09/04/2026' })).statusCode).toBe(400);
      expect((await post({ ...VALID_TRANSACTION, date: '2026-9-4' })).statusCode).toBe(400);
    });

    it('should reject calendar dates that do not exist', async () => {
      const res = await post({ ...VALID_TRANSACTION, date: '2026-02-30' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject a non-string description', async () => {
      expect((await post({ ...VALID_TRANSACTION, description: 42 })).statusCode).toBe(400);
    });

    it('should run after authentication, so an unauthenticated request is 401 not 400', async () => {
      const res = await request(app).post('/transactions').send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('validateUpdateTransaction (PATCH /transactions/:id)', () => {
    let transactionId = '';

    beforeAll(async () => {
      const created = await post(VALID_TRANSACTION);
      transactionId = created.body.data.id;
    });

    it('should accept a valid partial update', async () => {
      const res = await patch(transactionId, { amount: 500 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.amount).toBe(500);
    });

    it('should reject an empty body', async () => {
      const res = await patch(transactionId, {});

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toBe('At least one field must be provided to update');
    });

    it('should reject unknown fields so they cannot be persisted onto the record', async () => {
      const res = await patch(transactionId, { hackedField: 'malicious' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toMatch(/Unknown field\(s\): hackedField/);
    });

    it('should validate fields that are present', async () => {
      expect((await patch(transactionId, { amount: -1 })).statusCode).toBe(400);
      expect((await patch(transactionId, { type: 'banana' })).statusCode).toBe(400);
      expect((await patch(transactionId, { date: 'not-a-date' })).statusCode).toBe(400);
      expect((await patch(transactionId, { category: '' })).statusCode).toBe(400);
    });
  });

  describe('validateTransactionQuery (GET /transactions)', () => {
    it('should accept valid filters', async () => {
      const res = await request(app)
        .get('/transactions?type=expense&category=Food&startDate=2026-09-01&endDate=2026-09-30')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it('should reject an invalid type filter', async () => {
      const res = await request(app)
        .get('/transactions?type=banana')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject malformed date filters', async () => {
      const res = await request(app)
        .get('/transactions?startDate=01-09-2026')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });

    it('should reject a startDate later than the endDate', async () => {
      const res = await request(app)
        .get('/transactions?startDate=2026-09-30&endDate=2026-09-01')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toMatch(/cannot be after/);
    });
  });

  describe('notFoundHandler', () => {
    it('should return a standardised 404 for an unknown route', async () => {
      const res = await request(app).get('/this-route-does-not-exist');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
      expect(res.body.error.message).toContain('GET /this-route-does-not-exist');
    });
  });

  describe('errorHandler', () => {
    it('should convert malformed JSON into a 400 rather than crashing', async () => {
      const res = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('{"name":');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_JSON');
    });

    it('should return every error in the same envelope', async () => {
      const res = await request(app).get('/nope');

      expect(Object.keys(res.body).sort()).toEqual(['error', 'success']);
      expect(Object.keys(res.body.error).sort()).toEqual(['code', 'message']);
    });
  });

  describe('CORS middleware', () => {
    it('should expose Access-Control-Allow-Origin on responses', async () => {
      const res = await request(app).get('/health');

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should answer preflight OPTIONS requests', async () => {
      const res = await request(app)
        .options('/transactions')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      expect([200, 204]).toContain(res.statusCode);
    });
  });

  describe('rateLimiter', () => {
    it('should return a 429 in the standard error envelope once the limit is exceeded', async () => {
      const limitedApp = express();
      limitedApp.use(createRateLimiter({ windowMs: 60000, limit: 2 }));
      limitedApp.get('/ping', (req, res) => res.status(200).json({ success: true, data: {} }));
      limitedApp.use(errorHandler);

      expect((await request(limitedApp).get('/ping')).statusCode).toBe(200);
      expect((await request(limitedApp).get('/ping')).statusCode).toBe(200);

      const blocked = await request(limitedApp).get('/ping');

      expect(blocked.statusCode).toBe(429);
      expect(blocked.body.success).toBe(false);
      expect(blocked.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });
});
