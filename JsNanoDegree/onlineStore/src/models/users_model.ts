import client from '../database';
import bcrypt from 'bcrypt';

export type user = {
  id?: number;
  firstname: string;
  lastname: string;
  password: string;
};

const pepper = process.env.PEPPER;
const saltRounds = process.env.SALT_ROUNDS;

/*Each Instance of this class represents a row in the table.*/

export class UserStore {
  async index(): Promise<user[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. ${err}`);
    }
  }

  async show(id: number): Promise<user | null> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) {
        return result.rows[0];
      }
      return null;
    } catch (err) {
      throw new Error(`Could not find user ${id}. ${err}`);
    }
  }

  async create(user: user): Promise<user> {
    try {
      const sql =
        'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      if (!saltRounds) {
        throw new Error('SALT_ROUNDS is not defined');
      }

      const hashedPassword = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds),
      );
      const result = await conn.query(sql, [
        user.firstname,
        user.lastname,
        hashedPassword,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new user ${user.firstname}. ${err}`);
    }
  }

  async authenticate(
    firstname: string,
    lastname: string,
    password: string,
  ): Promise<user | null> {
    try {
      const sql = 'SELECT * FROM users WHERE firstname=($1) AND lastname=($2)';
      const conn = await client.connect();
      const result = await conn.query(sql, [firstname, lastname]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(
        `Could not authenticate user ${firstname}. Error: ${err}`,
      );
    }
  }
}
