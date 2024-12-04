const request = require('supertest');
const authRoutes = require('../routes/auth');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRoutes);


// Mocking the database connection
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
  }),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$hashedPassword'), // Mock hashed password
}));

describe('POST /register', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mysql.createConnection().query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Missing username or password
  it('should return an error for missing username or password', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: '', password: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing username or password');
  });

  // Username already exists
  it('should return an error if the username already exists', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, [{ id: 1, username: 'existingUser' }]); // Mock user exists
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'existingUser', password: 'password123' });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Username already exists');
  });

  // Database error while checking for existing username
  it('should handle database errors gracefully when checking for existing username', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'newUser', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error checking for existing user');
  });

  // Successful registration
  it('should register a user successfully', async () => {
    mysql.createConnection().query
      // Mock no user exists
      .mockImplementationOnce((query, params, callback) => {
        callback(null, []);
      })
      // Mock successful insertion
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { insertId: 1 });
      });

    const response = await request(app)
      .post('/register')
      .send({ username: 'newUser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully!');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); // Ensure password is hashed
  });

  // Database error while inserting user
  it('should handle database errors gracefully when inserting user', async () => {
    mysql.createConnection().query
      // Mock no user exists
      .mockImplementationOnce((query, params, callback) => {
        callback(null, []);
      })
      // Mock database error on insertion
      .mockImplementationOnce((query, params, callback) => {
        callback(new Error('Database insertion error'), null);
      });

    const response = await request(app)
      .post('/register')
      .send({ username: 'newUser', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Registration failed (database error)');
  });
});
