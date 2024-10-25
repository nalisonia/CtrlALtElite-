import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

const { Pool } = require('pg');
jest.mock('pg'); // Mock the pg module

describe('PostgreSQL Pool', () => {
  let pool;

  beforeAll(() => {
    // Mock the Pool constructor and the query function
    Pool.mockImplementation(() => {
      return {
        query: jest.fn().mockImplementation((query, callback) => {
          callback(null, { rows: [{ now: '2024-10-24 10:00:00' }] }); // Mock current time
        }),
      };
    });

    // Import the pool instance after the mock is set up
    pool = require('../db.js'); // Update this path to the actual file
  });

  it('should connect to the database and return the current time', (done) => {
    pool.query('SELECT NOW()', (err, res) => {
      expect(err).toBeNull();
      expect(res.rows[0].now).toBe('2024-10-24 10:00:00');
      done();
    });
  });

  it('should handle database connection errors', (done) => {
    // Override the mock to simulate an error
    pool.query.mockImplementationOnce((query, callback) => {
      callback(new Error('Connection failed'), null);
    });

    pool.query('SELECT NOW()', (err, res) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('Connection failed');
      expect(res).toBeNull();
      done();
    });
  });
});
