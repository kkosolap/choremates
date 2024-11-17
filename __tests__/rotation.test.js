const mysql = require('mysql2');
require('dotenv').config({ path: '.env.test' });

jest.setTimeout(10000); // Global timeout of 10 seconds


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

jest.useFakeTimers(); // to enable fake timers

// Import necessary modules and your functions
const { resetAndRotateGroupUserChores, rotateChoreToNextUser } = require('../api/index'); // adjust the path as necessary
// const db = require('./dbTestConfig'); // mock DB module (revision: we mock db module below)

// Mock the DB module (to avoid actual DB interactions)
jest.mock('../api/index', () => ({
    resetAndRotateGroupUserChores: jest.fn(), // Mock the function
    rotateChoreToNextUser: jest.fn() 
    // another possibility of mocking
    // const mockResetAndRotate = jest.fn();
    // const rotateChore = jest.fn();
}));

/*
beforeEach(async () => {
    // Clean up previous test data
    const cleanupQuery = 'DELETE FROM group_chores WHERE group_id = 101';
    await db.promise().query(cleanupQuery);
});
*/

test('should reset and rotate chores based on their recurrence type', async () => {
    // insert data into db
    const insertChoresQuery = `
        INSERT INTO group_chores (group_id, group_chore_name, recurrence, assigned_to, is_completed)
        VALUES
        (101, 'test daily', 'Daily', 201, 0),
        (101, 'test weekly', 'Weekly', 202, 0)
    `;
    await db.promise().query(insertChoresQuery);

    const rotateChoreMock = jest.fn(async (groupId, choreId, assignedTo) => {
        console.log(`Rotating chore ${choreId} for group ${groupId} to next user ${assignedTo}`);
    })

    rotateChoreToNextUser.mockImplementation(rotateChoreMock); // replacing original function with mock

    await resetAndRotateGroupUserChores('Daily'); // call for daily chores

    jest.advanceTimersByTime(86400000); // fast forward one day

    expect(rotateChoreMock).toHaveBeenCalledTimes(0); // we expect it to not have been called... we dont rotate chores daily

    jest.advanceTimersByTime(604800000); // fast forward one week

    expect(rotateChoreMock).toHaveBeenCalledTimes(2); // daily chore and weekly chore reset every week
    expect(rotateChoreMock).toHaveBeenCalledWith(101, 1, 201); // this is the daily chore
    expect(rotateChoreMock).toHaveBeenCalledWith(101, 2, 202); // this is the weekly chore

    // Clean up: delete test data from the DB
    const cleanupQuery = 'DELETE FROM group_chores WHERE group_id IN (101, 102)';
    await db.promise().query(cleanupQuery);
});

// Close DB connection after tests
afterAll(() => {
    db.end();
});