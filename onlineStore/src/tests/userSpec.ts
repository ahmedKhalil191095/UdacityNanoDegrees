import supertest from 'supertest';
import app from '../server';
import jwt from 'jsonwebtoken';
import client from '../database';

const cleanUpDatabase = async () => {
  await client.query('DELETE FROM users');
  await client.query('DELETE FROM orders');
  await client.query('DELETE FROM products');
  await client.query('DELETE FROM orderproduct');

  await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
  await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
};

const request = supertest(app);

let token: string;

// A mock user object for creating and testing
const mockUser = {
  firstname: 'ahmed',
  lastname: 'fathallah',
  password: 'password123',
};

describe('User API Endpoints', () => {
  beforeAll(async () => {
    // Generate a token for testing protected routes
    token = jwt.sign({ user: mockUser }, process.env.TOKEN_SECRET as string);
    await cleanUpDatabase(); // Clean the database after each test
  });

  describe('Test user creation (POST /users)', () => {
    it('should create a new user and return a token', async () => {
      const response = await request.post('/users').send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      token = response.body; // Save the token for further requests
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request.post('/users').send({
        firstname: 'John',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        'firstname, lastname and password are required',
      );
    });
  });

  describe('Test index endpoint (GET /users)', () => {
    it('should return a list of users', async () => {
      const response = await request.get('/users').send({ token }); // Send token in body for verification

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 if token is missing or invalid', async () => {
      const response = await request.get('/users');
      expect(response.status).toBe(401);
    });
  });

  describe('Test show endpoint (GET /users/:id)', () => {
    it('should return a single user by ID', async () => {
      const response = await request.get('/users/userID/1').send({ token }); // Send token in body for verification

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it('should return 400 if ID is invalid', async () => {
      const response = await request.get('/users/userID/0').send({ token });
      expect(response.status).toBe(400);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request.get('/users/userID/1');
      expect(response.status).toBe(401);
    });
  });
});
