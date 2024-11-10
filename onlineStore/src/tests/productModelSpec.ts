import { ProductStore, product } from '../models/products_model';
import client from '../database';

interface MockConnection {
  query: jasmine.Spy;
  release: jasmine.Spy;
}

describe('ProductStore Model', () => {
  let store: ProductStore;
  let mockConn: MockConnection;

  beforeEach(() => {
    store = new ProductStore();
    mockConn = {
      query: jasmine.createSpy('query'),
      release: jasmine.createSpy('release'),
    };
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn));
  });

  describe('create method', () => {
    it('should create a new product and return it', async () => {
      const mockProduct: product = { id: 1, name: 'Product 1', price: 100 };
      mockConn.query.and.returnValue(Promise.resolve({ rows: [mockProduct] }));

      const result = await store.create({ name: 'Product 1', price: 100 });
      expect(result).toEqual(mockProduct);
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith(
        'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *;',
        ['Product 1', 100],
      );
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should throw an error if creating the product fails', async () => {
      mockConn.query.and.throwError('Test error');

      await expectAsync(
        store.create({ name: 'Product 1', price: 100 }),
      ).toBeRejectedWithError(
        'Could not add new product Product 1. Error: Test error',
      );
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });
  });

  describe('index method', () => {
    it('should return a list of products', async () => {
      const mockProducts: product[] = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];

      mockConn.query.and.returnValue(Promise.resolve({ rows: mockProducts }));

      const result = await store.index();
      expect(result).toEqual(mockProducts);
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith('SELECT * FROM products;');
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should throw an error if fetching products fails', async () => {
      mockConn.query.and.throwError('Test error');

      await expectAsync(store.index()).toBeRejectedWithError(
        'Could not get products. Error: Test error',
      );
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });
  });

  describe('show method', () => {
    it('should return a product by id', async () => {
      const mockProduct: product = { id: 1, name: 'Product 1', price: 100 };
      mockConn.query.and.returnValue(Promise.resolve({ rows: [mockProduct] }));

      const result = await store.show(1);
      expect(result).toEqual(mockProduct);
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith(
        'SELECT * FROM products WHERE id=($1);',
        [1],
      );
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should return null if no product is found', async () => {
      mockConn.query.and.returnValue(Promise.resolve({ rows: [] }));

      const result = await store.show(999); // Assuming 999 does not exist
      expect(result).toBeNull();
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith(
        'SELECT * FROM products WHERE id=($1);',
        [999],
      );
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should throw an error if fetching product fails', async () => {
      mockConn.query.and.throwError('Test error');

      await expectAsync(store.show(1)).toBeRejectedWithError(
        'Could not find product 1. Error: Test error',
      );
      expect(client.connect).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });
  });
});
