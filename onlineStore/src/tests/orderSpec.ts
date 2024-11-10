import supertest from 'supertest';
import app from '../server';
import jwt from 'jsonwebtoken';
import { OrderStore } from '../models/orders_model';

const request = supertest(app);
const order_store = new OrderStore();
// const product_store = new ProductStore();
import client from '../database';
// import { ProductStore } from '../models/products_model';

const cleanUpDatabase = async () => {
  await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
};



enum status {
  active = 'active',
  completed = 'completed',
  shipped = 'shipped',
}

export type order = {
  id?: number;
  userid: number;
  status: status;
};

const mockProduct = {
  name: 'Sword of Power',
  price: 500,
};

// A mock user object for creating and testing
const mockUser = {
  firstname: 'ahmed',
  lastname: 'fathallah',
  password: 'password123',
};

describe('Order Route', () => {
  let token: string;
  beforeAll(() => {
    token = jwt.sign({ user: mockUser }, process.env.TOKEN_SECRET as string);
    cleanUpDatabase();

  });

  describe('POST /orders', () => {
    it('should require a token', async () => {
      const res = await request.post('/orders').send({
        userid: 1,
        status: 'active',
      });
      expect(res.status).toBe(401);
    });


    it('should create a new order', async () => {
      spyOn(order_store, 'create').and.returnValue(
        Promise.resolve({ id: 1, userid: 1, status: 'active' } as order),
      );
      const res = await request.post('/orders').send({
        userid: 1,
        status: 'active',
        token,
      });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        userid: '1',
        status: 'active',
      });
    });

    it('should create a new order', async () => {
      spyOn(order_store, 'create').and.returnValue(
        Promise.resolve({ id: 2, userid: 2, status: 'complete' }),
      );
      const res = await request.post('/orders').send({
        userid: 2,
        status: 'complete',
        token,
      });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 2,
        userid: '2',
        status: 'complete',
      });
    });

    it('should return 400 if userid or status is missing', async () => {
      const res = await request.post('/orders').send({
        status: 'active',
        token,
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('should require a token', async () => {
      const res = await request.get('/orders/1');
      expect(res.status).toBe(401);
      expect(res.body).toEqual(`error: invalid token`);
    });

    it('should get an order by ID', async () => {
      spyOn(order_store, 'show').and.returnValue(
        Promise.resolve({ id: 1, userid: 1, status: 'active' } as order),
      );
      const res = await request.get('/orders/1').send({ token });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        userid: '1',
        status: 'active',
      });
    });

    it('should return 400 if ID is invalid', async () => {
      const res = await request.get('/orders/abc').send({ token });
      expect(res.status).toBe(400);
      expect(res.body).toEqual('id should be number!');
    });
  });

  describe('POST /orders/:orderId/products/:productId/:quantity', () => {
    it('should require a token', async () => {
      const res = await request.post('/orders/1/products/1/10');
      expect(res.status).toBe(401);
    });

    it('should return 400 if orderId or productId or quantity is not a number', async () => {
      const res = await request
        .post('/orders/abc/products/1/10')
        .send({ token });
      expect(res.status).toBe(400);

      const res2 = await request
        .post('/orders/1/products/abc/10')
        .send({ token });
      expect(res2.status).toBe(400);

      const res3 = await request
        .post('/orders/1/products/1/abc')
        .send({ token });
      expect(res3.status).toBe(400);
    });
    it('should create a new product with valid token', async () => {
      const response = await request
        .post('/products')
        .send({ ...mockProduct, token });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(mockProduct.name);
    });

    it('should add a product to an order', async () => {
      spyOn(order_store, 'addProductToOrder').and.returnValue(
        Promise.resolve({ orderId: 1, productId: 1, quantity: 10 }),
      );
      spyOn(order_store, 'show').and.returnValue(
        Promise.resolve({ id: 1, userid: 1, status: 'active' } as order),
      );

      const res = await request.post('/orders/1/products/1/10').send({ token });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ orderid: 1, productid: 1, quantity: 10 });
    });

    it('should return 400 if quantity is 0 or less', async () => {
      const res = await request.post('/orders/1/products/1/0').send({ token });
      expect(res.status).toBe(400);
      expect(res.body).toEqual('quantity must be greater than 0');
    });

    it('should return 404 if order is not found', async () => {
      spyOn(order_store, 'show').and.returnValue(
        Promise.resolve({ id: 20, userid: 1, status: 'active' }),
      );
      const res = await request.post('/orders/20/products/1/10').send({ token });
      expect(res.status).toBe(404);
    });

    it('should return 400 if order is not active', async () => {
      spyOn(order_store, 'show').and.returnValue(
        Promise.resolve({
          id: 2,
          userid: 2,
          status: 'complete',
        } as unknown as order),
      );
      const res = await request.post('/orders/2/products/1/10').send({ token });
      expect(res.status).toBe(400);
    });
  });
});
