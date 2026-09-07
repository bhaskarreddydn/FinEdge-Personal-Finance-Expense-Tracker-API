const request = require('supertest');
const app = require('../src/app');

describe('Health Check API', () => {
  it('GET /health should return 200 OK with status OK', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        status: 'OK',
      },
    });
  });

  it('GET /api/nonexistent should return 404 ROUTE_NOT_FOUND', async () => {
    const res = await request(app).get('/api/nonexistent-endpoint-xyz');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
