// Import necessary modules and your function
const { resetAndRotateGroupUserChores, rotateChoreToNextUser } = require('../api/index'); // replace with actual path
const db = require('./dbTestConfig'); // replace with actual database file path

jest.mock('./dbTestConfig', () => ({
    promise: jest.fn(() => ({
        query: jest.fn(),
    })),
}));

describe('resetAndRotateGroupUserChores', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('resets chores and calls rotation for weekly recurrence', async () => {
        // Mock database response
        db.promise().query
            .mockResolvedValueOnce([
                [ // group chores response
                    { id: 1, group_id: 101, assigned_to: 201, is_completed: true },
                    { id: 2, group_id: 101, assigned_to: 202, is_completed: true },
                ],
            ])
            .mockResolvedValueOnce([]); // For updating is_completed

        // Mock rotateChoreToNextUser
        const mockRotateChore = jest.spyOn(require('../api/index'), 'rotateChoreToNextUser').mockResolvedValue();

        // Call the function
        await resetAndRotateGroupUserChores('Weekly');

        // Assertions
        expect(db.promise().query).toHaveBeenCalledWith(
            'SELECT id, group_id, assigned_to, is_completed FROM group_chores WHERE recurrence = ?',
            ['Weekly']
        );

        expect(db.promise().query).toHaveBeenCalledWith(
            'UPDATE group_chores SET is_completed = false WHERE id = ?',
            [1] // This would iterate for each chore
        );

        expect(mockRotateChore).toHaveBeenCalledWith(101, 1, 201);
        expect(mockRotateChore).toHaveBeenCalledWith(101, 2, 202);
    });
});


describe('rotateChoreToNextUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('rotates chore to the next user', async () => {
        // Mock database response
        db.promise().query
            .mockResolvedValueOnce([
                [ // Users in the group
                    { id: 201 },
                    { id: 202 },
                    { id: 203 },
                ],
            ])
            .mockResolvedValueOnce(); // For updating the assigned_to column

        // Call the function
        await rotateChoreToNextUser(101, 1, 201);

        // Assertions
        expect(db.promise().query).toHaveBeenCalledWith(
            'SELECT id FROM group_members WHERE group_id = ? ORDER BY id ASC',
            [101]
        );

        expect(db.promise().query).toHaveBeenCalledWith(
            'UPDATE group_chores SET assigned_to = ? WHERE id = ?',
            [202, 1] // Next user and chore ID
        );
    });
});
