import client from '../database';

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

export class OrderStore {
  async show(id: number): Promise<order | null> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`);
    }
  }

  async create(order: order): Promise<order> {
    try {
      const sql =
        'INSERT INTO orders (userId, status) VALUES($1, $2) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [order.userid, order.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new order. ${err}`);
    }
  }

  /*
   * this function will add a product to an order
   * @returns {Promise<order>}
   * @para takes a necessary parameters for the join tables
   */
  async addProductToOrder(
    orderId: number,
    productId: number,
    quantity: number,
  ) {
    try {
      const sql =
        'INSERT INTO orderproduct (orderId, productId, quantity) VALUES($1, $2, $3) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}. ${err}`,
      );
    }
  }
}
