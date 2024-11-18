const mysql = require('mysql2');
require('dotenv').config({ path: '.env.test' });

jest.setTimeout(20000); // Global timeout of 20 seconds

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: 'utf8mb4'
});

jest.useFakeTimers(); // to enable fake timers

// Import necessary modules and your functions
const { resetAndRotateGroupUserChores, rotateChoreToNextUser } = require('../api/index'); // adjust the path as necessary
// const db = require('./dbTestConfig'); // mock DB module (revision: we mock db module below)

/*
// Mock the DB module (to avoid actual DB interactions)
jest.mock('../api/index', () => ({
    resetAndRotateGroupUserChores: jest.fn().mockResolvedValue(true), // Mock the function
    rotateChoreToNextUser: jest.fn() 
    // another possibility of mocking
    // const mockResetAndRotate = jest.fn();
    // const rotateChore = jest.fn();
}));
*/

/*
beforeEach(async () => {
    // Clean up previous test data
    const cleanupQuery = 'DELETE FROM group_chores WHERE group_id = 101';
    await db.promise().query(cleanupQuery);
});
*/

describe('resetAndRotateGroupuserChores tests', () => {
    test('should reset and rotate chores based on their recurrence type', async () => {
        const rotateChoreSpy = jest.spyOn(require('../api/index'), 'rotateChoreToNextUser');
        console.log('Running resetAndRotateGroupUserChores for Daily chores...');
        await resetAndRotateGroupUserChores('Daily'); // Call the original function

        jest.advanceTimersByTime(86400000); // Fast forward one day
        expect(rotateChoreSpy).not.toHaveBeenCalled(); // No rotation for daily chores

        // Optionally verify that the original `rotateChoreToNextUser` was not called
        expect(rotateChoreSpy).not.toHaveBeenCalled();
    });

    test('should reset weekly chores and rotate them', async () => {
        // Spy on the original function without mocking it
        const rotateChoreSpy = jest.spyOn(require('../api/index'), 'rotateChoreToNextUser');

        // Call resetAndRotateGroupUserChores and let it do its real work
        console.log('Running resetAndRotateGroupUserChores for Weekly chores...');
        await resetAndRotateGroupUserChores('Weekly');

        jest.advanceTimersByTime(604800000); // Fast forward one week
        expect(rotateChoreSpy).toHaveBeenCalledTimes(2); // Rotation happens for weekly chores

        // Optionally verify the calls to the original `rotateChoreToNextUser`
        expect(rotateChoreSpy).toHaveBeenCalledWith(101, 1, 201); // First chore rotation
        expect(rotateChoreSpy).toHaveBeenCalledWith(101, 2, 202); // Second chore rotation
    });
    console.log('done');
});


// Close DB connection after tests
afterAll(async () => {
    db.end();
});