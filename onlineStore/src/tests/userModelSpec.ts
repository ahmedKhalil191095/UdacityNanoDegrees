import { UserStore, user } from '../models/users_model';
import client from '../database';
import { PoolClient } from 'pg'; // Import the correct type for PoolClient
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const store = new UserStore();

describe('UserStore Model', () => {
  // Define the correct type for mockConn based on PoolClient
  let mockConn: Partial<PoolClient>;

  beforeEach(() => {
    // Manually mock the client.connect and connection.query function
    mockConn = {
      query: jasmine.createSpy('query').and.returnValue(
        Promise.resolve({
          rows: [
            {
              id: 1,
              firstname: 'John',
              lastname: 'Doe',
              password: 'hashedPassword',
            },
          ],
        }),
      ),
      release: jasmine.createSpy('release'),
    };

    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn));
  });

  describe('index method', () => {
    it('should return a list of users', async () => {
      // Mock the database query result
      const mockUsers: user[] = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          password: 'hashedpassword',
        },
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Doe',
          password: 'hashedpassword',
        },
      ];

      (mockConn.query as jasmine.Spy).and.returnValue(
        Promise.resolve({ rows: mockUsers }),
      );

      const result = await store.index();
      expect(result).toEqual(mockUsers);
      expect(mockConn.query).toHaveBeenCalledWith('SELECT * FROM users');
    });

    it('should throw an error if index query fails', async () => {
      (mockConn.query as jasmine.Spy).and.throwError('Query Error');

      await expectAsync(store.index()).toBeRejectedWithError(
        'Could not get users. Error: Query Error',
      );
    });
  });

  describe('show method', () => {
    it('should return a user by ID', async () => {
      // Mock the database query result
      const mockUser: user = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashedpassword',
      };

      (mockConn.query as jasmine.Spy).and.returnValue(
        Promise.resolve({ rows: [mockUser] }),
      );

      const result = await store.show(1);
      expect(result).toEqual(mockUser);
      expect(mockConn.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id=($1)',
        [1],
      );
    });

    it('should return null if no user found by ID', async () => {
      (mockConn.query as jasmine.Spy).and.returnValue(
        Promise.resolve({ rows: [] }),
      );

      const result = await store.show(999); // Assuming user ID 999 does not exist
      expect(result).toBeNull();
    });

    it('should throw an error if show query fails', async () => {
      const err = 'Query Error';
      (mockConn.query as jasmine.Spy).and.throwError(err);
      const id = 1;
      await expectAsync(store.show(id)).toBeRejectedWithError(
        `Could not find user ${id}. Error: ${err}`,
      );
    });
  });

  describe('create method', () => {
    const store = new UserStore();
    it('should create a new user', async () => {
      const mockUser: user = {
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123',
      };

      const bcryptSpy = spyOn(bcrypt, 'hashSync').and.returnValue(
        'hashedPassword',
      );

      // Act
      const result = await store.create(mockUser);

      // Assert
      expect(client.connect).toHaveBeenCalled();
      expect(bcryptSpy).toHaveBeenCalledWith(
        mockUser.password + process.env.PEPPER,
        parseInt(process.env.SALT_ROUNDS as string),
      );
      expect(mockConn.query).toHaveBeenCalledWith(
        'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *',
        [mockUser.firstname, mockUser.lastname, 'hashedPassword'],
      );
      expect(result).toEqual({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashedPassword',
      });
    });

    it('should handle errors gracefully', async () => {
      const mockUser: user = {
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123',
      };
      const err = 'Database error';
      // Simulate an error in the query
      (mockConn.query as jasmine.Spy).and.throwError(err);
      await expectAsync(store.create(mockUser)).toBeRejectedWithError(
        `Could not add new user ${mockUser.firstname}. Error: ${err}`,
      );
    });
  });
});
