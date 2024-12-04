const request = require('supertest');
const groupRoutes = require('../routes/groups');
const mysql = require('mysql2');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', groupRoutes);

// Mocking the database connection
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
  }),
}));

describe('GET /get-group-members', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mysql.createConnection().query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Missing group_id
  it('should return an error if group_id is missing', async () => {
    const response = await request(app).get('/get-group-members').query({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing group_id');
  });

  // Database error
  it('should handle database errors gracefully', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).get('/get-group-members').query({ group_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to retrieve group members');
  });

  // Successful retrieval
  it('should return group members and their roles successfully', async () => {
    const mockResults = [
      { username: 'user1', display_name: 'User One', user_id: 1, role: 'admin' },
      { username: 'user2', display_name: 'User Two', user_id: 2, role: 'member' },
    ];

    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app).get('/get-group-members').query({ group_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResults);
  });
});
