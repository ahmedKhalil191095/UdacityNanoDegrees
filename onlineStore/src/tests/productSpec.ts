import supertest from 'supertest';
import app from '../server'; // Import your Express server instance
import jwt from 'jsonwebtoken';
// import { ProductStore } from '../models/products_model'; // Import the ProductStore
// const product_store = new ProductStore();

const request = supertest(app);
let token: string;

// A mock product object for creating and testing
const mockProduct = {
  name: 'Sword of Power',
  price: 500,
};

describe('Product API Endpoints', () => {
  beforeAll(() => {
    // Generate a token for testing protected routes
    token = jwt.sign({ user: 'testUser' }, process.env.TOKEN_SECRET as string);
  });

  describe('Test product creation (POST /products)', () => {
    it('should create a new product with valid token', async () => {
      const response = await request
        .post('/products')
        .send({ ...mockProduct, token });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(mockProduct.name);
    });

    it('should return 400 if name or price is missing', async () => {
      const response = await request
        .post('/products')
        .send({ name: 'Incomplete product' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual('name and price are required');
    });

    it('should return 401 if token is missing or invalid', async () => {
      const response = await request.post('/products').send(mockProduct); // No token here

      expect(response.status).toBe(401);
      expect(response.body).toContain('invalid token');
    });
  });

  describe('Test index endpoint (GET /products)', () => {
    it('should return a list of products', async () => {
      const response = await request.get('/products');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Test show endpoint (GET /products/:id)', () => {
    it('should return a single product by ID', async () => {
      const response = await request.get('/products/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it('should return 400 if ID is not valid', async () => {
      const response = await request.get('/products/aaa');
      expect(response.status).toBe(400);
      expect(response.body).toEqual('id should be number!');
    });
  });
});
