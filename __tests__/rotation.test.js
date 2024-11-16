// Import necessary modules and your functions
const { resetAndRotateGroupUserChores, rotateChoreToNextUser } = require('../api/index'); // adjust the path as necessary
const db = require('./dbTestConfig'); // mock DB module

jest.useFakeTimers();

// Mock the DB module (to avoid actual DB interactions)
jest.mock('../api/index', () => ({
    resetAndRotateGroupUserChores: jest.fn(), // Mock the function
    rotateChoreToNextUser: jest.fn(),
}));

