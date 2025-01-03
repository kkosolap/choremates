// recurrence.js

const db = require('../db/connection');
const cron = require('node-cron');

/********************************************************** */
/*       RECURRENCE & ROTATION IMPLEMENTATION BELOW:        */
/********************************************************** */
// cron job for daily and weekly resets - AT
// every minute for test purposes - AT
cron.schedule('* * * * *', () => { resetAndRotateChores('Every Minute'); });
cron.schedule('0 0 * * *',  () => { resetAndRotateChores('Daily'); });
cron.schedule('0 0 * * 1',  () => { resetAndRotateChores('Weekly'); }); // resets every midnight after Sunday (12am Monday)

// function to handle single user recurrence -AT
async function resetAndRotateChores(type) {
    try {
        await resetSingleUserChores(type);          // single-user chores recurrence
        await resetAndRotateGroupUserChores(type);  // group-user chores recurrence and rotation
    } catch (error) {
        console.error("Error in resetAndRotateChores:", error);
    }
}

async function resetSingleUserChores(type) {
    const query = `SELECT id, is_completed FROM chores WHERE recurrence = ?`;
    const [chores] = await db.promise().query(query, [type]);

    for (const chore of chores) {
        const query = `UPDATE chores SET is_completed = false WHERE id = ?`;
        try{
            await db.promise().query(query, [chore.id]);
        } catch (error) {
            console.error("Error resetting chore:", error);
        }
    }
}

async function resetAndRotateGroupUserChores(type) {
    const query = `SELECT id, group_id, assigned_to, is_completed, rotation_enabled FROM group_chores WHERE recurrence = ?`;
    const [groupChores] = await db.promise().query(query, [type]);

    for (const chore of groupChores) {
        const query = `UPDATE group_chores SET is_completed = false WHERE id = ?`;
        try{
            await db.promise().query(query, [chore.id]);

            // only rotate if rotationEnabled
            if (chore.rotation_enabled) {
                // all chores rotate when they recur (daily rotate daily, weekly rotate weekly, etc)
                await rotateChoreToNextUser(chore.group_id, chore.id, chore.assigned_to);
            }

        } catch (error) {
            console.error("Error resetting chore:", error);
        }
    }
}

async function rotateChoreToNextUser(group_id, chore_id, current_assigned_to) {
    try {
        // retrieve all users in the group (order them for consistent rotation) -AT
        const query = 'SELECT user_id FROM group_members WHERE group_id = ? ORDER BY user_id ASC'
        const [users] = await db.promise().query(query, [group_id]);

        // find the current user in the sorted user list -AT
        const currentIndex = users.findIndex(user => user.user_id === current_assigned_to);
        if (currentIndex === -1) {
            console.error(`User with ID ${current_assigned_to} not found in group ${group_id}.`);
            return;
        }

        // Rotate to the next user (loop back to the first user if at the end) -AT
        const nextUser = users[(currentIndex + 1) % users.length];

        // Update the chore with the new user assignment -AT
        const updateQuery = `UPDATE group_chores SET assigned_to = ? WHERE id = ?`;
        await db.promise().query(updateQuery, [nextUser.user_id, chore_id]);

    } catch (error) {
        console.error("Error rotating group chore to the next user:", error);
    }
}

