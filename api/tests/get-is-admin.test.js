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

describe('GET /get-is-admin', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mysql.createConnection().query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Missing username or group_id
  it('should return an error if username or group_id is missing', async () => {
    const response = await request(app).get('/get-is-admin').query({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and group ID are required');
  });

  // Database error
  it('should handle database errors gracefully', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null); 
    });

    const response = await request(app).get('/get-is-admin').query({ username: 'existingUser', group_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to check admin status');
  });

  // User is not an admin
  it('should return false if the user is not an admin in the group', async () => {
    const mockResults = [{ role: 'member' }]; // User is a member, not an admin

    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults); // Return a non-admin role
    });

    const response = await request(app).get('/get-is-admin').query({ username: 'existingUser', group_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.isAdmin).toBe(false); // User is not an admin
  });

  // User is an admin
  it('should return true if the user is an admin in the group', async () => {
    const mockResults = [{ role: 'admin' }]; // User is an admin

    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults); // Return an admin role
    });

    const response = await request(app).get('/get-is-admin').query({ username: 'existingUser', group_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.isAdmin).toBe(true); // User is an admin
  });

  // User not found in the group
  it('should return false if the user is not part of the group', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, []); // No results, meaning user is not in the group
    });

    const response = await request(app).get('/get-is-admin').query({ username: 'nonExistentUser', group_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.isAdmin).toBe(false); // User is not part of the group, therefore not an admin
  });
});
