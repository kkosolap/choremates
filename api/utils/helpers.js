// helpers.js

const db = require('../db/connection');

/********************************************************** */
/*                HELPER FUNCTIONS BELOW:                */
/********************************************************** */
// gets the user id given a username -KK
async function getUserId(username) {
    const [results] = await db.promise().query("SELECT id FROM users WHERE username = ?", [username]);
    if (results.length === 0) {
        console.log(`API getUserId: User ${username} not found`);
        throw new Error(`User ${username} not found`);
    }
    return results[0].id;
}

// gets the chore id and completion status given a chore_name -KK
async function getChoreIdAndCompletionStatus(chore_name, user_id) {
    const [results] = await db.promise().query("SELECT id, is_completed FROM chores WHERE chore_name = ? AND user_id = ?", [chore_name, user_id]);    
    if (results.length === 0) {
        console.log(`API getChoreIdAndCompletionStatus: Chore ${chore_name} not found`);
        throw new Error(`Chore ${chore_name} not found`);
    }
    return { chore_id: results[0].id, is_completed: results[0].is_completed };
}

// gets the group chore id and completion status given a chore_name -KK
async function getGroupChoreIdAndCompletionStatus(group_chore_name, group_id) {
    const query = `SELECT id, is_completed FROM group_chores WHERE group_chore_name = ? AND group_id = ?`
    const [results] = await db.promise().query(query, [group_chore_name, group_id]);    
    if (results.length === 0) {
        console.log(`API getGroupChoreIdAndCompletionStatus: Chore ${group_chore_name} not found`);
        throw new Error(`Chore ${group_chore_name} not found`);
    }
    return { group_chore_id: results[0].id, is_completed: results[0].is_completed };
}

// gets the task id given a task_name -KK
async function getTaskId(task_name, chore_id) {
    const [results] = await db.promise().query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id]);
    if (results.length === 0) {
        console.log(`API getTaskId: Task ${task_name} not found`);
        throw new Error(`Task ${task_name} not found`);
    }
    return results[0].id;
}

// gets the task id given a task_name -KK
async function getGroupTaskId(group_task_name, group_chore_id) {
    const [results] = await db.promise().query("SELECT id FROM group_tasks WHERE group_task_name = ? AND group_chore_id = ?", [group_task_name, group_chore_id]);
    if (results.length === 0) {
        console.log(`API getTaskId: Task ${group_task_name} not found`);
        throw new Error(`Task ${group_task_name} not found`);
    }
    return results[0].id;
}

// check the user's group chore modification permission
const canModifyChore = async (username, group_id) => {
    const query = `
        SELECT can_modify_chore
        FROM group_members
        JOIN users ON group_members.user_id = users.id
        WHERE users.username = ? AND group_members.group_id = ?
    `;
    const [rows] = await db.promise().query(query, [username, group_id]);
    if (rows.length === 0) {
        throw new Error("User is not a member of the group.");
    }
    return rows[0].can_modify_chore;
};

module.exports = { getUserId, getChoreIdAndCompletionStatus, getGroupChoreIdAndCompletionStatus, getTaskId, getGroupTaskId, canModifyChore };
