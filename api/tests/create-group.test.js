const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');

// Mocking the database connection
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
    promise: jest.fn().mockReturnValue({
      query: jest.fn(),
    }),
  }),
}));

describe('POST /create-group', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mysql.createConnection().query.mockReset();
    mysql.createConnection().promise().query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Missing group name or username
  it('should return an error if group name or username is missing', async () => {
    const response = await request(app)
      .post('/create-group')
      .send({ group_name: '', username: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing group name or username');
  });

  // Group name too long
  it('should return an error if group name exceeds 14 characters', async () => {
    const response = await request(app)
      .post('/create-group')
      .send({ group_name: 'LongggggggggggggggggggggggggggggggggggggggggGroupName', username: 'user1' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Group name must be less than 15 characters');
  });

  // Database error when inserting group
  it('should handle database errors gracefully when inserting a group', async () => {
    mysql.createConnection().promise().query.mockResolvedValueOnce([[{ id: 1 }]]); // Mock user ID
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database insertion error'), null);
    });

    const response = await request(app)
      .post('/create-group')
      .send({ group_name: 'Group1', username: 'user1' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to create group');
  });

  // Database error when adding group member
  it('should handle database errors gracefully when adding group member', async () => {
    mysql.createConnection().promise().query.mockResolvedValueOnce([[{ id: 1 }]]); // Mock user ID
    mysql.createConnection().query
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { insertId: 101 }); // Mock group created
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(new Error('Database insertion error'), null); // Error adding member
      });

    const response = await request(app)
      .post('/create-group')
      .send({ group_name: 'Group1', username: 'user1' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to add user to group');
  });

  // Successful group creation
  it('should create a group successfully', async () => {
    mysql.createConnection().promise().query.mockResolvedValueOnce([[{ id: 1 }]]); // Mock user ID
    mysql.createConnection().query
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { insertId: 101 }); // Mock group created
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null); // Mock member added
      });

    const response = await request(app)
      .post('/create-group')
      .send({ group_name: 'Group1', username: 'user1' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Group created successfully');
    expect(response.body.group_id).toBe(101); // Confirm group ID
  });
});
