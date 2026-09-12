/**
 * Summary API Test Suite.
 * Authored by Member 4 (Sangram) - Automated Testing & QA.
 */
const request = require('supertest');
const fs = require('fs/promises');
const path = require('path');
const app = require('../src/app');

const USERS_FILE_PATH = path.join(__dirname, '../src/data/users.json');
const TRANSACTIONS_FILE_PATH = path.join(__dirname, '../src/data/transactions.json');

const resetDataFiles = async () => {
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  await fs.writeFile(TRANSACTIONS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
};

const registerAndLogin = async (email = 'summary-test@example.com') => {
  const userPayload = {
    name: 'Summary Tester',
    email,
    password: 'password123',
  };

  await request(app).post('/users').send(userPayload);

  const loginRes = await request(app).post('/users/login').send({
    email: userPayload.email,
    password: userPayload.password,
  });

  return loginRes.body.data.accessToken;
};

describe('Summary API', () => {
  let authToken;

  beforeEach(async () => {
    await resetDataFiles();
    authToken = await registerAndLogin();
  });

  afterEach(async () => {
    await resetDataFiles();
  });

  it('GET /summary should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/summary');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /summary should return zero totals for a user with no transactions', async () => {
    const res = await request(app)
      .get('/summary')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: 0,
      categoryBreakdown: {},
    });
  });

  it('GET /summary should calculate total income, total expense, and balance correctly', async () => {
    // Add income
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'income',
        category: 'Salary',
        amount: 5000,
        date: '2026-09-01',
        description: 'Monthly Salary',
      });

    // Add another income
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'income',
        category: 'Freelance',
        amount: 1500,
        date: '2026-09-05',
        description: 'Side project',
      });

    // Add expense 1
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Rent',
        amount: 2000,
        date: '2026-09-02',
        description: 'Apartment rent',
      });

    // Add expense 2
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 500,
        date: '2026-09-03',
        description: 'Groceries',
      });

    const res = await request(app)
      .get('/summary')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalIncome).toBe(6500);
    expect(res.body.data.totalExpense).toBe(2500);
    expect(res.body.data.balance).toBe(4000);
    expect(res.body.data.transactionCount).toBe(4);
    expect(res.body.data.categoryBreakdown).toEqual({
      Salary: { total: 5000, count: 1 },
      Freelance: { total: 1500, count: 1 },
      Rent: { total: 2000, count: 1 },
      Food: { total: 500, count: 1 },
    });
  });

  it('GET /summary should isolate summary by authenticated user', async () => {
    // Current user transaction
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'income',
        category: 'Salary',
        amount: 3000,
        date: '2026-09-01',
      });

    // Second user transaction
    const secondUserToken = await registerAndLogin('other-user@example.com');
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({
        type: 'expense',
        category: 'Shopping',
        amount: 1000,
        date: '2026-09-02',
      });

    // Verify first user's summary does not include second user's transactions
    const res = await request(app)
      .get('/summary')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalIncome).toBe(3000);
    expect(res.body.data.totalExpense).toBe(0);
    expect(res.body.data.balance).toBe(3000);
    expect(res.body.data.transactionCount).toBe(1);
    expect(res.body.data.categoryBreakdown).toHaveProperty('Salary');
    expect(res.body.data.categoryBreakdown).not.toHaveProperty('Shopping');
  });

  it('GET /summary should support category filter query', async () => {
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 300,
        date: '2026-09-01',
      });

    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Transport',
        amount: 100,
        date: '2026-09-02',
      });

    const res = await request(app)
      .get('/summary')
      .query({ category: 'Food' })
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalExpense).toBe(300);
    expect(res.body.data.transactionCount).toBe(1);
  });
});
