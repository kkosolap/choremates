// chores.js

const express = require('express');
const router = express.Router();

const db = require('../db/connection');
const { getUserId, getChoreIdAndCompletionStatus, getGroupChoreIdAndCompletionStatus, canModifyChore } = require('../utils/helpers');

/********************************************************** */
/*             CHORE IMPLEMENTATION BELOW:                  */
/********************************************************** */
// get all chores for a user -KK
router.post('/get-chores', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-chores: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const [results] = await db.promise().query("SELECT id, chore_name, recurrence FROM chores WHERE user_id = ?", [user_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-chores: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get all the chores and associated tasks for a specific user -KK
router.post('/get-chores-data', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            console.log("API get-chores-data: Missing username.");
            return res.status(400).send("Missing username.");
        }

        const user_id = await getUserId(username);

        const query = `
            SELECT 
                chores.chore_name, 
                chores.is_completed AS chore_is_completed, 
                chores.recurrence AS chore_recurrence,
                tasks.id,
                tasks.task_name, 
                tasks.is_completed AS task_is_completed
            FROM chores
            LEFT JOIN tasks ON chores.id = tasks.chore_id
            WHERE chores.user_id = ?
        `;

        const [results] = await db.promise().query(query, [user_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-chores-data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// add a new chore for the user -KK
router.post('/add-chore', async (req, res) => {
    try {
        const { chore_name, username, recurrence } = req.body;
        if (!chore_name || !username || !recurrence) {
            console.log("API add-chore: Missing chore, username, or recurrence.");
            return res.status(400).send("Missing chore, username, or recurrence.");
        }

        const user_id = await getUserId(username);
        const [duplicate] = await db.promise().query("SELECT id FROM chores WHERE user_id = ? AND chore_name = ?", [user_id, chore_name]);
        if (duplicate.length > 0) {
            console.log("API add-chore: Duplicate chore name.");
            return res.status(400).json({ message: `Chore ${chore_name} already exists.` });
        }

        const query = "INSERT INTO chores (user_id, chore_name, recurrence) VALUES (?, ?, ?)";
        await db.promise().query(query, [user_id, chore_name, recurrence]);
        res.status(200).json({ message: "Chore added successfully." });
    } catch (error) {
        console.error("API add-chore: Error:", error.message);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// update the details of a chore -MH
router.post('/update-chore', async (req, res) => {
    try {
        const { old_chore_name, new_chore_name, username, recurrence } = req.body;
        if (!old_chore_name || !new_chore_name || !username || !recurrence) {
            console.log("API update-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }

        const user_id = await getUserId(username);

        if (old_chore_name != new_chore_name) { 
            const [duplicate] = await db.promise().query("SELECT id FROM chores WHERE user_id = ? AND chore_name = ?", [user_id, new_chore_name]);
            if (duplicate.length > 0) {
                console.log("API add-chore: Duplicate chore name.");
                return res.status(400).json({ message: `Chore ${new_chore_name} already exists.` });
            }
        }
        
        // Update the chore details in the database
        const query = `
            UPDATE chores
            SET chore_name = ?, recurrence = ?
            WHERE user_id = ? AND chore_name = ?
        `;
        await db.promise().query(query, [new_chore_name, recurrence, user_id, old_chore_name]);

        res.status(200).json({ message: "Chore updated successfully." });
    } catch (error) {
        console.error("API update-chore: Error:", error.message);
        res.status(500).send("An error occurred while updating the chore.");
    }
});

// deletes a chore for the user from the database -KK
router.post('/delete-chore', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if (!chore_name || !username) {
            console.log("API delete-chore: Missing chore or username.");
            return res.status(400).send("Missing chore or username.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        await db.promise().query("DELETE FROM chores WHERE id = ?", [chore_id]);
        res.status(200).json({ message: "Chore deleted successfully." });
    } catch (error) {
        console.error("API delete-chore: Error:", error.message);
        res.status(500).send("An error occurred while deleting the chore.");
    }
});

// toggle the completion status of a chore, false -> true and true -> false -KK
router.post('/complete-chore', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
    
        if (!chore_name || !username) {
            console.log("API complete-chore: Missing username or chore name.");
            return res.status(400).send("Missing username or chore name.");
        }
        
        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        
        await db.promise().query("UPDATE chores SET is_completed = NOT is_completed WHERE id = ?", [chore_id]);

        res.status(200).json({ message: "Chore completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-chore: Error:", error.message);
        res.status(500).send("An error occurred while toggling chore completion status.");
    }
});


/********************************************************** */
/*              GROUP CHORE IMPLEMENTATION BELOW:           */
/********************************************************** */
// get all the chores and associated tasks for a specific user -KK
router.post('/get-group-chores-data', async (req, res) => {
    try {
        const { group_id } = req.body;
        if (!group_id) {
            console.log("API get-group-chores-data: Missing group id.");
            return res.status(400).send("Missing group id.");
        }

        const query = `
            SELECT 
                group_chores.group_id,
                group_chores.group_chore_name, 
                group_chores.is_completed AS chore_is_completed, 
                group_chores.recurrence AS chore_recurrence,
                group_chores.assigned_to,
                group_tasks.group_task_name, 
                group_tasks.is_completed AS task_is_completed
            FROM group_chores
            LEFT JOIN group_tasks ON group_chores.id = group_tasks.group_chore_id
            WHERE group_chores.group_id = ?
        `;

        const [results] = await db.promise().query(query, [group_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-group-chores-data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get all the chores and associated tasks for a specific user -KK
router.post('/get-group-chores-data-for-user', async (req, res) => {
    try {
        const { group_id, username } = req.body;
        if (!group_id) {
            console.log("API get-group-chores-data: Missing group id or username.");
            return res.status(400).send("Missing group id or username.");
        }

        const user_id = await getUserId(username);

        const query = `
            SELECT 
                group_chores.group_id,
                group_chores.group_chore_name, 
                group_chores.is_completed AS chore_is_completed, 
                group_chores.recurrence AS chore_recurrence,
                group_chores.assigned_to,
                group_tasks.id,
                group_tasks.group_task_name, 
                group_tasks.is_completed AS task_is_completed
            FROM group_chores
            LEFT JOIN group_tasks ON group_chores.id = group_tasks.group_chore_id
            WHERE group_chores.assigned_to = ? AND group_chores.group_id = ?
        `;

        const [results] = await db.promise().query(query, [user_id, group_id]);
        res.json(results);
    } catch (error) {
        console.error("API get-group-chores-data: Error:", error.message);
        res.status(500).send("Error retrieving chores.");
    }
});

// get group_name by group_id -MH
router.post('/get-group-name', async (req, res) => {
    const { group_id } = req.body;
    try {
        const [results] = await db.promise().query("SELECT group_name FROM group_names WHERE id = ?", [group_id]);
        if (results.length === 0) {
        return res.status(404).json({ error: 'Group not found' });
        }
        res.json({ group_name: results[0].group_name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// add a new chore to the group -KK
router.post('/add-group-chore', async (req, res) => {
    try {
        // username (user who's trying to add this group chore) --EL
        const { group_chore_name, group_id, assign_to, recurrence, username, rotation_enabled } = req.body;
        if (!group_chore_name || !group_id || !assign_to || !recurrence || !username) {
            console.log("API add-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }  
        

        // check if rotationEnabled is valid - AT
        const isRotationEnabled = rotation_enabled ? 1 : 0; // default is 0
        
        const [duplicate] = await db.promise().query("SELECT id FROM group_chores WHERE group_id = ? AND group_chore_name = ?", [group_id, group_chore_name]);
        if (duplicate.length > 0) {
            console.log("API add-group-chore: Duplicate chore name.");
            return res.status(400).json({ message: `Chore ${group_chore_name} already exists for this group.` });
        }

        const query = "INSERT INTO group_chores (group_id, group_chore_name, recurrence, assigned_to, rotation_enabled) VALUES (?, ?, ?, ?, ?)";
        await db.promise().query(query, [group_id, group_chore_name, recurrence, assign_to, isRotationEnabled]);
        res.status(200).json({ message: "Chore added to group successfully." });
    } catch (error) {
        console.error("API add-group-chore: Error:", error.message);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// update the details of a chore -MH
router.post('/update-group-chore', async (req, res) => {
    try {
        // username (user who's trying to update this group chore) --EL
        const { old_chore_name, new_chore_name, group_id, recurrence, assign_to, username, rotation_enabled } = req.body;
        if (!old_chore_name || !new_chore_name || !group_id || !recurrence || !assign_to || !username) {
            console.log("API update-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }

        // check permissions
        const hasPermission = await canModifyChore(username, group_id);
        if (!hasPermission) {
            console.log("API update-group-chore: No permission to modify chores in this group.");
            return res.status(403).send("You do not have permission to modify chores in this group.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(old_chore_name, group_id);

        if (old_chore_name != new_chore_name){ 
            const [duplicate] = await db.promise().query("SELECT id FROM group_chores WHERE group_id = ? AND group_chore_name = ?", [group_id, new_chore_name]);
            if (duplicate.length > 0) {
                console.log("API update-group-chore: Duplicate chore name.");
                return res.status(400).json({ message: `Chore ${new_chore_name} already exists for this group.` });
            }
        }

        // Update the chore details in the database
        const query = `
            UPDATE group_chores
            SET group_chore_name = ?, recurrence = ?, assigned_to = ?, rotation_enabled = ?
            WHERE id = ?
        `;
        await db.promise().query(query, [new_chore_name, recurrence, assign_to, rotation_enabled, group_chore_id ]);

        res.status(200).json({ message: "Chore updated successfully." });
    } catch (error) {
        console.error("API update-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while updating the chore.");
    }
});

router.post('/delete-group-chore', async (req, res) => {
    try {
        const { group_chore_name, group_id, username } = req.body;
        if (!group_chore_name || !group_id || !username) {
            console.log("API delete-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }

        // check permissions
        const hasPermission = await canModifyChore(username, group_id);
        if (!hasPermission) {
            console.log("API delete-group-chore: No permission to modify chores in this group.");
            return res.status(403).send("You do not have permission to modify chores in this group.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);

        await db.promise().query("DELETE FROM group_chores WHERE id = ?", [group_chore_id]);
        res.status(200).json({ message: "Chore deleted successfully." });
    } catch (error) {
        console.error("API delete-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while deleting the chore.");
    }
});

// toggle the completion status of a group chore, false -> true and true -> false -KK
router.post('/complete-group-chore', async (req, res) => {
    try {
        const { group_chore_name, group_id } = req.body;
    
        if (!group_chore_name || !group_id) {
            console.log("API complete-group-chore: Missing required fields.");
            return res.status(400).send("Missing required fields.");
        }
        
        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        
        await db.promise().query("UPDATE group_chores SET is_completed = NOT is_completed WHERE id = ?", [group_chore_id]);

        res.status(200).json({ message: "Chore completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-group-chore: Error:", error.message);
        res.status(500).send("An error occurred while toggling chore completion status.");
    }
});

module.exports = router;
