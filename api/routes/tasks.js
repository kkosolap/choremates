// tasks.js

const express = require('express');
const router = express.Router();

const db = require('../db/connection');
const { getUserId, getChoreIdAndCompletionStatus, getGroupChoreIdAndCompletionStatus, getTaskId, getGroupTaskId, canModifyChore } = require('../utils/helpers');

/********************************************************** */
/*               TASK IMPLEMENTATION BELOW:                 */
/********************************************************** */
// gets a list of tasks given a chore -KK
router.post('/get-tasks', async (req, res) => {
    try {
        const { chore_name, username } = req.body;
        if(!chore_name || !username){
            console.log("API get-tasks: Missing username or chore name.");
            return res.status(400).send("Missing username or chore name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);

        // get the tasks from the database -KK
        const [tasks] = await db.promise().query("SELECT task_name from tasks WHERE chore_id = ?", [chore_id]);
        res.status(200).json(tasks);
    } catch (error) {
        console.error("API get-tasks: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});

// adds a task for a given chore to the database -KK
router.post('/add-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if(!chore_name || !task_name || !username){
            console.log("API add-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id, is_completed } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        
        const [duplicate] = await db.promise().query("SELECT id FROM tasks WHERE task_name = ? AND chore_id = ?", [task_name, chore_id]);
        if (duplicate.length > 0) {
            console.log("API add-task: Duplicate task name.");
            return res.status(400).json({ message: `Cannot create task ${task_name}. This task already exists for this chore.` });
        }

        // add the task to the database -KK
        await db.promise().query("INSERT INTO tasks (chore_id, task_name) VALUES (?, ?)", [chore_id, task_name]);  
        
        // mark chore as incomplete -KK
        if(is_completed){
            await db.promise().query("UPDATE chores SET is_completed = NOT is_completed WHERE id = ?", [chore_id]);
        }
        res.status(200).json({ message: "Changed completion successfully." });
    } catch (error) {
        console.error("API add-task: Error:", error.message);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});
   
// deletes a task for a given chore from the database -KK
router.post('/delete-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API delete-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("DELETE FROM tasks WHERE id = ?", [task_id]);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("API delete-task: Error:", error.message);
        res.status(500).send("An error occurred while deleting the task.");
    }
});

// toggles the completion status of the task, false -> true and true -> false -KK
router.post('/complete-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API complete-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?", [task_id]);
        res.status(200).json({ message: "Task completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-task: Error:", error.message);
        res.status(500).send("An error occurred while toggling task completion status.");
    }
});

// matches the completion status of the task to match the completion status of the chore
router.post('/match-task', async (req, res) => {
    try {
        const { chore_name, task_name, username } = req.body;
        if (!chore_name || !task_name || !username) {
            console.log("API match-task: Missing username, chore name, or task name.");
            return res.status(400).send("Missing username, chore name, or task name.");
        }

        const user_id = await getUserId(username);
        const { chore_id, is_completed } = await getChoreIdAndCompletionStatus(chore_name, user_id);
        const task_id = await getTaskId(task_name, chore_id);

        await db.promise().query("UPDATE tasks SET is_completed = ? WHERE id = ?", [is_completed, task_id]);
        res.status(200).json({ message: "Task completion status matched successfully." });
    } catch (error) {
        console.error("API match-task: Error:", error.message);
        res.status(500).send("An error occurred while matching task completion status.");
    }
});         

/********************************************************** */
/*               GROUP TASK IMPLEMENTATION BELOW:           */
/********************************************************** */
// gets a list of all tasks given a group chore -KK
router.post('/get-group-tasks', async (req, res) => {
    try {
        const { group_chore_name, group_id } = req.body;
        if(!group_chore_name || !group_id){
            console.log("API get-group-tasks: Missing group name or chore name.");
            return res.status(400).send("Missing group name or chore name.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);

        // get the tasks from the database -KK
        const [group_tasks] = await db.promise().query("SELECT group_task_name from group_tasks WHERE group_chore_id = ?", [group_chore_id]);
        res.status(200).json(group_tasks);
    } catch (error) {
        console.error("API get-group-tasks: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});

// adds a task for a given group chore to the database -KK
router.post('/add-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id, username } = req.body;
        if(!group_chore_name || !group_task_name || !group_id || !username){
            console.log("API add-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        } 

        // check permissions
        const hasPermission = await canModifyChore(username, group_id);
        if (!hasPermission) {
            console.log("API add-group-task: No permission to modify tasks in this group.");
            return res.status(403).send("You do not have permission to modify tasks in this group.");
        }

        const { group_chore_id, is_completed } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const [duplicate] = await db.promise().query("SELECT id FROM group_tasks WHERE group_task_name = ? AND group_chore_id = ?", [group_task_name, group_chore_id]);
        if (duplicate.length > 0) {
            console.log("API add-group-task: Duplicate task name.");
            return res.status(400).send("This task already exists.");
        }

        // add the task to the database -KK
        await db.promise().query("INSERT INTO group_tasks (group_chore_id, group_task_name) VALUES (?, ?)", [group_chore_id, group_task_name]);  
        
        // mark chore as incomplete -KK
        if(is_completed){
            await db.promise().query("UPDATE group_chores SET is_completed = NOT is_completed WHERE id = ?", [group_chore_id]);
        }
        res.status(200).json({ message: "Changed completion successfully." });
    } catch (error) {
        console.error("API add-group-task: Error:", error.message);
        res.status(500).send("An error occurred while adding the task.");
    }
});
   
// deletes a task for a given chore from the database -KK
router.post('/delete-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id, username } = req.body;
        if (!group_chore_name || !group_task_name || !group_id || !username) {
            console.log("API delete-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        }

        // check permissions
        const hasPermission = await canModifyChore(username, group_id);
        if (!hasPermission) {
            console.log("API delete-group-task: No permission to modify tasks in this group.");
            return res.status(403).send("You do not have permission to modify tasks in this group.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const group_task_id = await getGroupTaskId(group_task_name, group_chore_id);

        await db.promise().query("DELETE FROM group_tasks WHERE id = ?", [group_task_id]);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("API delete-group-task: Error:", error.message);
        res.status(500).send("An error occurred while deleting the task.");
    }
});

// toggles the completion status of the task, false -> true and true -> false -KK
router.post('/complete-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id } = req.body;
        if (!group_chore_name || !group_task_name || !group_id) {
            console.log("API complete-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        }

        const { group_chore_id } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const group_task_id = await getGroupTaskId(group_task_name, group_chore_id);

        await db.promise().query("UPDATE group_tasks SET is_completed = NOT is_completed WHERE id = ?", [group_task_id]);
        res.status(200).json({ message: "Task completion status toggled successfully." });
    } catch (error) {
        console.error("API complete-group-task: Error:", error.message);
        res.status(500).send("An error occurred while toggling task completion status.");
    }
});

// matches the completion status of the task to match the completion status of the chore
router.post('/match-group-task', async (req, res) => {
    try {
        const { group_chore_name, group_task_name, group_id } = req.body;
        if (!group_chore_name || !group_task_name || !group_id) {
            console.log("API match-group-task: Missing fields.");
            return res.status(400).send("Missing fields.");
        }

        const { group_chore_id, is_completed } = await getGroupChoreIdAndCompletionStatus(group_chore_name, group_id);
        const group_task_id = await getGroupTaskId(group_task_name, group_chore_id);

        await db.promise().query("UPDATE group_tasks SET is_completed = ? WHERE id = ?", [is_completed, group_task_id]);
        res.status(200).json({ message: "Task completion status matched successfully." });
    } catch (error) {
        console.error("API match-group-task: Error:", error.message);
        res.status(500).send("An error occurred while matching task completion status.");
    }
});

// get all saved group color themes for a specific user -MH
router.get('/get-group-themes', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            console.log("API get-group-themes: Missing username.");
            return res.status(400).send("Missing username.");
        }
        const user_id = await getUserId(username);
    
        if (!user_id) {
            console.log("API get-group-themes: Missing user_id");
            return res.status(400).json({ error: "Missing user_id" });
        }
    
        // Fetch group themes for the user
        const [rows] = await db.promise().query(
            `SELECT group_id, group_color AS theme
            FROM group_members
            WHERE user_id = ?`,
            [user_id]
        );
    
        if (rows.length > 0) {
            res.json(rows); // Return found themes [{ group_id, theme }]
          } else {
            res.json([]); // Return empty array if no data found
          }
    } catch (error) {
        console.error("API get-group-themes: Error fetching group themes:", error.message);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});

// change a user's color theme for a specific group  -VA
router.post('/update-group-theme', async (req, res) => {
    const { username, group_id, group_color } = req.body;

    // Validate input
    if (!username || !group_id || !group_color) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    try {
      const user_id = await getUserId(username);
      
      if (!user_id) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const [result] = await db.promise().query(
        'UPDATE group_members SET group_color = ? WHERE group_id = ? AND user_id = ?',
        [group_color, group_id, user_id]
      );
      
      // Check if the update was successful
      if (result.affectedRows > 0) {
        return res.json({ success: true });
      } else {
        return res.status(404).json({ success: false, error: 'Group not found or no changes made' });
      }
    } catch (error) {
      console.error('Error updating group color:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
