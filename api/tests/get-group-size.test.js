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

describe('GET /get-group-size', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mysql.createConnection().query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Missing group_id
  it('should return an error if group_id is missing', async () => {
    const response = await request(app).get('/get-group-size').query({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Group ID is required');
  });

  // Database error
  it('should handle database errors gracefully', async () => {
    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).get('/get-group-size').query({ group_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to retrieve group member count');
  });

  // Successful retrieval
  it('should return the member count successfully', async () => {
    const mockResults = [{ member_count: 100 }];

    mysql.createConnection().query.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const response = await request(app).get('/get-group-size').query({ group_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ member_count: 100 });
  });
});
