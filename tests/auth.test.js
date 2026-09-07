const request = require('supertest');
const fs = require('fs/promises');
const path = require('path');
const app = require('../src/app');

const USERS_FILE_PATH = path.join(__dirname, '../src/data/users.json');

describe('User Authentication API', () => {
  // Reset users.json before and after all tests
  beforeEach(async () => {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  });

  afterAll(async () => {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  });

  describe('POST /users (Registration)', () => {
    it('should successfully register a new user and return 201 without password', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          name: 'Bhaskar Reddy',
          email: 'bhaskar@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Bhaskar Reddy');
      expect(res.body.data.email).toBe('bhaskar@example.com');
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data.password).toBeUndefined();
    });

    it('should fail with 400 VALIDATION_ERROR when required fields are missing', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          email: 'incomplete@example.com',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with 409 USER_ALREADY_EXISTS if email already exists', async () => {
      // First registration
      await request(app)
        .post('/users')
        .send({
          name: 'Bhaskar Reddy',
          email: 'bhaskar@example.com',
          password: 'password123',
        });

      // Duplicate registration attempt
      const res = await request(app)
        .post('/users')
        .send({
          name: 'Bhaskar Duplicate',
          email: 'bhaskar@example.com',
          password: 'anotherpassword',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('USER_ALREADY_EXISTS');
      expect(res.body.error.message).toBe('A user with this email already exists');
    });
  });

  describe('POST /users/login (Authentication)', () => {
    beforeEach(async () => {
      // Register a standard user for login tests
      await request(app)
        .post('/users')
        .send({
          name: 'Bhaskar Reddy',
          email: 'bhaskar@example.com',
          password: 'password123',
        });
    });

    it('should successfully log in with valid credentials and return JWT access token', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'bhaskar@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.tokenType).toBe('Bearer');
      expect(res.body.data.expiresIn).toBe('1h');
    });

    it('should reject login with 401 INVALID_CREDENTIALS for wrong password', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'bhaskar@example.com',
          password: 'wrong_password',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login with 401 INVALID_CREDENTIALS for unregistered email', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
