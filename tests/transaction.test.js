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

const registerAndLogin = async () => {
  const userPayload = {
    name: 'Transaction Tester',
    email: 'transaction-test@example.com',
    password: 'password123',
  };

  await request(app).post('/users').send(userPayload);

  const loginRes = await request(app).post('/users/login').send({
    email: userPayload.email,
    password: userPayload.password,
  });

  return loginRes.body.data.accessToken;
};

describe('Transaction API', () => {
  let authToken;

  beforeEach(async () => {
    await resetDataFiles();
    authToken = await registerAndLogin();
  });

  afterEach(async () => {
    await resetDataFiles();
  });

  it('POST /transactions should create a transaction for the authenticated user', async () => {
    const res = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 350,
        date: '2026-09-09',
        description: 'Lunch with team',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      type: 'expense',
      category: 'Food',
      amount: 350,
      date: '2026-09-09',
      description: 'Lunch with team',
    });
    expect(res.body.data).toHaveProperty('id');
  });

  it('GET /transactions should return only the authenticated user transactions', async () => {
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 250,
        date: '2026-09-08',
        description: 'Groceries',
      });

    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'income',
        category: 'Salary',
        amount: 12000,
        date: '2026-09-01',
        description: 'Monthly salary',
      });

    const res = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ category: 'Food' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      category: 'Food',
      type: 'expense',
      amount: 250,
    });
  });

  it('PATCH /transactions/:id should update an existing transaction', async () => {
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Transport',
        amount: 150,
        date: '2026-09-07',
        description: 'Auto ride',
      });

    const res = await request(app)
      .patch(`/transactions/${createRes.body.data.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 200,
        description: 'Updated cab ride',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: createRes.body.data.id,
      amount: 200,
      description: 'Updated cab ride',
      category: 'Transport',
    });
  });

  it('DELETE /transactions/:id should remove an existing transaction', async () => {
    const createRes = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'expense',
        category: 'Shopping',
        amount: 900,
        date: '2026-09-06',
        description: 'Books',
      });

    const res = await request(app)
      .delete(`/transactions/${createRes.body.data.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: createRes.body.data.id,
      category: 'Shopping',
      amount: 900,
    });

    const getRes = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.body.data).toHaveLength(0);
  });
});
