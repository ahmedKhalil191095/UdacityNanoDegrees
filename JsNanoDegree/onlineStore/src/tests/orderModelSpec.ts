import { OrderStore, order } from '../models/orders_model';
import client from '../database';

interface MockConnection {
  query: jasmine.Spy;
  release: jasmine.Spy;
}

describe('OrderStore Model', () => {
  let store: OrderStore;
  let mockConn: MockConnection; // Use the proper type here

  beforeEach(() => {
    store = new OrderStore();
    // Initialize mockConn with proper type and mock methods
    mockConn = {
      query: jasmine
        .createSpy('query')
        .and.returnValue(Promise.resolve({ rows: [] })),
      release: jasmine.createSpy('release'),
    };
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn));
  });

  describe('create method', () => {
    it('should create a new order and return it', async () => {
      const mockOrder: order = { userid: 1, status: 'active' } as order;
      const returnedOrder = { id: 1, ...mockOrder };
      mockConn.query.and.returnValue(
        Promise.resolve({ rows: [returnedOrder] }),
      );

      const result = await store.create(mockOrder);
      expect(result).toEqual(returnedOrder);
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith(
        'INSERT INTO orders (userId, status) VALUES($1, $2) RETURNING *;',
        [mockOrder.userid, mockOrder.status],
      );
    });

    it('should throw an error if order creation fails', async () => {
      mockConn.query.and.throwError('Test error');

      await expectAsync(
        store.create({ userid: 1, status: 'active' } as order),
      ).toBeRejectedWithError('Could not add new order. Error: Test error');
      expect(client.connect).toHaveBeenCalled();
    });
  });

  describe('show method', () => {
    it('should return an order by id', async () => {
      const mockOrder: order = { id: 1, userid: 1, status: 'active' } as order;
      mockConn.query.and.returnValue(Promise.resolve({ rows: [mockOrder] }));

      const result = await store.show(1);
      expect(result).toEqual(mockOrder);
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE id=($1);',
        [1],
      );
    });

    it('should return null if no order is found', async () => {
      mockConn.query.and.returnValue(Promise.resolve({ rows: [] }));

      const result = await store.show(1);
      expect(result).toBeNull();
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE id=($1);',
        [1],
      );
    });

    it('should throw an error if an exception occurs', async () => {
      mockConn.query.and.throwError('Test error');

      await expectAsync(store.show(1)).toBeRejectedWithError(
        'Could not find order 1. Error: Test error',
      );
      expect(client.connect).toHaveBeenCalled();
    });
  });

  describe('OrderStore Model - addProductToOrder', () => {
    describe('addProductToOrder method', () => {
      it('should successfully add a product to an order and return the new orderproduct', async () => {
        const mockOrderProduct = {
          orderId: 1,
          productId: 2,
          quantity: 10,
        };

        mockConn.query.and.returnValue(
          Promise.resolve({ rows: [mockOrderProduct] }),
        );

        const result = await store.addProductToOrder(1, 2, 10);
        expect(result).toEqual(mockOrderProduct);
        expect(client.connect).toHaveBeenCalled();
        expect(mockConn.query).toHaveBeenCalledWith(
          'INSERT INTO orderproduct (orderId, productId, quantity) VALUES($1, $2, $3) RETURNING *;',
          [1, 2, 10],
        );
      });

      it('should throw an error if adding the product fails', async () => {
        mockConn.query.and.throwError('Test error');

        await expectAsync(
          store.addProductToOrder(1, 2, 10),
        ).toBeRejectedWithError(
          'Could not add product 2 to order 1. Error: Test error',
        );
        expect(client.connect).toHaveBeenCalled();
      });
    });
  });
});
