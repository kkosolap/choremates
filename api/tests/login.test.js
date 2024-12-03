const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');

// Mocking the database connection
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
  }),
}));

describe('POST /login', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mysql.createConnection().query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Username does not exist
  it('should return an error for invalid username', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'invalidUser',
        password: 'password123',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid username or password');
  });

  // Wrong password
  it('should return an error for invalid password', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, [{
        id: 1,
        username: 'existingUser',
        security_key: '$2a$10$PewEqA5IjFfC5UlgB7fuvOr3vhMIXYhM5yFdc6MEJocPQm9rxa1m0', // bcrypt hash for 'password123'
      }]);
    });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'existingUser',
        password: 'wrongPassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid username or password');
  });

  // Handle database errors gracefully
  it('should handle database errors gracefully', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'existingUser',
        password: 'password123',
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Database error');
  });

  // Successful login is manually tested
});
