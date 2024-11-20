import client from '../database';

export type product = {
  id?: number;
  name: string;
  price: number;
};

export class ProductStore {
  async index(): Promise<product[]> {
    let conn;
    try {
      conn = await client.connect();
      const sql = 'SELECT * FROM products;';
      const result = await conn.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async show(id: number): Promise<product | null> {
    let conn;
    try {
      const sql = 'SELECT * FROM products WHERE id=($1);';
      conn = await client.connect();
      const result = await conn.query(sql, [id]);
      return result.rows.length ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Could not find product ${id}. ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async create(product: product): Promise<product> {
    let conn;
    try {
      const sql =
        'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *;';
      conn = await client.connect();
      const result = await conn.query(sql, [product.name, product.price]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new product ${product.name}. ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}
